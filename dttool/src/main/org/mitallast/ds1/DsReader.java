package org.mitallast.ds1;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public class DsReader {

//    public static final int FLOOR_MAX_LAYER=2;
//    public static final int SHADOW_MAX_LAYER=1;
//    public static final int TAG_MAX_LAYER=1;
//    public static final int WALL_MAX_LAYER=4;

    public static void main(String... args) throws IOException {
        DsInfo dsInfo = read(new RandomAccessFile("tiles/ACT1/BARRACKS/barE.ds1", "r"));
//        for(DsLayerInfo[][] dsLayerInfo: dsInfo.wall_buff){
//            for (DsLayerInfo[] layerInfoList: dsLayerInfo){
//                for(DsLayerInfo layerInfo: layerInfoList){
//                    System.out.println(layerInfo);
//                }
//            }
//            break;
//        }
        System.out.println(dsInfo.obj_num);
        for(ObjectInfo objectInfo: dsInfo.obj){
            System.out.println(objectInfo);
        }
    }

    public static DsInfo read(RandomAccessFile in) throws IOException {

        byte [] dir_lookup = new byte[]{
            0x00, 0x01, 0x02, 0x01, 0x02, 0x03, 0x03, 0x05, 0x05, 0x06,
                    0x06, 0x07, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E,
                    0x0F, 0x10, 0x11, 0x12, 0x14};

        in.seek(0);
        FileByteBuffer buffer = new FileByteBuffer(in);

        DsInfo info = new DsInfo();

        info.version = buffer.getInt();
        info.width = buffer.getInt() + 1;
        info.height = buffer.getInt() + 1;
        if (info.version >= 8) {
            info.act = buffer.getInt() + 1;
        } else {
            info.act = 1;
        }
        if (info.version >= 10) {
            info.tag_type = buffer.getInt() + 1;
        } else {
            info.tag_type = 1;
        }

        info.file_num = 0;
        if (info.version >= 3) {
            info.file_num = buffer.getInt();
            info.files = new String[info.file_num];
            for (int i = 0; i < info.file_num; i++) {
                StringBuilder fileName = new StringBuilder();
                int symbol;
                do {
                    symbol = buffer.get() & 0xFF;
                    fileName.append(charSequence.charAt(symbol));
                } while (symbol != 0);
                info.files[i] = fileName.toString();
            }
        }

        // skip 2 bytes ?
        if ((info.version >= 9) && (info.version <= 13)){
            buffer.get(new byte[2]);
        }

        // number of wall, floor and tag layers
        if (info.version >= 4)
        {
            // number of wall (and orientation) layers
            info.wall_num = buffer.getInt();

            // number of floor layers
            if (info.version >= 16)
            {
                info.floor_num = buffer.getInt();
            }
            else
                info.floor_num = 1; // default # of floor layer
        }
        else // in version < 4
        {
            // # of layers hardcoded
            info.wall_num = 1;
            info.floor_num = 1;
            info.tag_num = 1;
        }

        int nb_layer;
        int[] lay_stream = new int[14];
        // which order ?
        if (info.version < 4)
        {
            lay_stream[0] =  1; // wall 1
            lay_stream[1] =  9; // floor 1
            lay_stream[2] =  5; // orientation 1
            lay_stream[3] = 12; // tag
            lay_stream[4] = 11; // shadow
            nb_layer = 5;
        }
        else
        {
            nb_layer = 0;
            for (int i=0; i<info.wall_num; i++)
            {
                lay_stream[nb_layer++] = 1 + i; // wall x
                lay_stream[nb_layer++] = 5 + i; // orientation x
            }
            for (int i=0; i<info.floor_num; i++)
                lay_stream[nb_layer++] = 9 + i; // floor x
            if (info.shadow_num >0)
                lay_stream[nb_layer++] = 11;    // shadow
            if (info.tag_num >0)
                lay_stream[nb_layer++] = 12;    // tag
        }

        System.out.printf("layers : (2 * %d walls) + %d floors + %d shadow + %d tag\n", info.wall_num, info.floor_num, info.shadow_num, info.tag_num);

        int MAX_LAYER = ( 2 * info.wall_num) + info.floor_num + info.shadow_num + info.tag_num;
//        info.layerInfo=new DsLayerInfo[MAX_LAYER][info.width][info.height];
//        for(int n=0;n<MAX_LAYER;n++){
//            for(int x=0;x<info.width;x++){
//                for (int y=0;y<info.height;y++){
//                    info.layerInfo[n][x][y]=new DsLayerInfo();
//                }
//            }
//        }
        info.wall_buff=new DsLayerInfo[info.wall_num][info.width][info.height];
        for(int n=0;n<info.wall_num;n++){
            for(int x=0;x<info.width;x++){
                for (int y=0;y<info.height;y++){
                    info.wall_buff[n][x][y]=new DsLayerInfo();
                }
            }
        }
        info.floor_buff=new DsLayerInfo[info.floor_num][info.width][info.height];
        for(int n=0;n<info.floor_num;n++){
            for(int x=0;x<info.width;x++){
                for (int y=0;y<info.height;y++){
                    info.floor_buff[n][x][y]=new DsLayerInfo();
                }
            }
        }
        info.shadow_buff=new DsLayerInfo[info.shadow_num][info.width][info.height];
        for(int n=0;n<info.shadow_num;n++){
            for(int x=0;x<info.width;x++){
                for (int y=0;y<info.height;y++){
                    info.shadow_buff[n][x][y]=new DsLayerInfo();
                }
            }
        }
        info.tag_buff=new DsLayerInfo[info.tag_num][info.width][info.height];
        for(int n=0;n<info.tag_num;n++){
            for(int x=0;x<info.width;x++){
                for (int y=0;y<info.height;y++){
                    info.shadow_buff[n][x][y]=new DsLayerInfo();
                }
            }
        }

        // set pointers

        int p;
        for (int n=0; n < nb_layer; n++)
        {
            for (int y=0; y < info.height; y++)
            {
                for (int x=0; x < info.width; x++)
                {
                    switch (lay_stream[n])
                    {
                        // walls
                        case  1:
                        case  2:
                        case  3:
                        case  4:
                            p = lay_stream[n] - 1;
                            info.wall_buff[p][x][y].prop1 = buffer.get();
                            info.wall_buff[p][x][y].prop2 = buffer.get();
                            info.wall_buff[p][x][y].prop3 = buffer.get();
                            info.wall_buff[p][x][y].prop4 = buffer.get();
                            break;
                        // orientations
                        case  5:
                        case  6:
                        case  7:
                        case  8:
                            p = lay_stream[n] - 5;
                            if (info.version < 7)
                                info.wall_buff[p][x][y].orientation = dir_lookup[buffer.get()&0xFF];
                            else{
                                info.wall_buff[p][x][y].orientation = buffer.get();
                            }
                            buffer.get(new byte[3]);
                            break;
                        // floors
                        case  9:
                        case 10:
                            p = lay_stream[n] - 9;
                            info.floor_buff[p][x][y].prop1 = buffer.get();
                            info.floor_buff[p][x][y].prop2 = buffer.get();
                            info.floor_buff[p][x][y].prop3 = buffer.get();
                            info.floor_buff[p][x][y].prop4 = buffer.get();
                            break;
                        // shadow
                        case 11:
                            p = lay_stream[n] - 11;
                            info.shadow_buff[p][x][y].prop1 = buffer.get();
                            info.shadow_buff[p][x][y].prop2 = buffer.get();
                            info.shadow_buff[p][x][y].prop3 = buffer.get();
                            info.shadow_buff[p][x][y].prop4 = buffer.get();
                            break;
                        // tag
                        case 12:
                            p = lay_stream[n] - 12;
                            info.tag_buff[p][x][y].num = buffer.get();
                            buffer.get(new byte[3]);
                            break;
                    }
                }
            }
        }


        info.obj_num = 0;
        if (info.version >= 2)
        {
            info.obj_num = buffer.getInt();
            //System.out.println("objects: "+info.obj_num);

            info.obj=new ObjectInfo[info.obj_num];
            for(int i=0;i<info.obj_num;i++){
                info.obj[i]=new ObjectInfo();
            }

            int current_valid_obj_idx = 0;
            int max_subtile_width     = info.width * 5;
            int max_subtile_height    = info.height * 5;
            for (int n=0; n < info.obj_num; n++)
            {
                info.obj[current_valid_obj_idx].type  = buffer.getInt();
                info.obj[current_valid_obj_idx].id    = buffer.getInt();
                int x = info.obj[current_valid_obj_idx].x = buffer.getInt();
                int y = info.obj[current_valid_obj_idx].y = buffer.getInt();

                if (info.version > 5)
                {
                    // flags
                    info.obj[current_valid_obj_idx].ds1_flags = buffer.getInt();
                }

                // integrity check (not done by the game I believe)
                if ((x >= 0) && (x < max_subtile_width) && (y >= 0) && (y < max_subtile_height))
                {
                    // some init for the paths of this object
                    info.obj[current_valid_obj_idx].path_num = 0;
                    info.obj[current_valid_obj_idx].desc_idx = -1;
                    info.obj[current_valid_obj_idx].flags    = 0;

                    //info.obj[current_valid_obj_idx].frame_delta = rand()%256;

                    //label = & info.obj[current_valid_obj_idx].label;
                    //label->rx = label->ry = label->w = label->h = label->flags = 0;

                    //System.out.println(info.obj[current_valid_obj_idx]);
                    current_valid_obj_idx++;
                }
            }
        }

        /* groups for tag layer

        warning : in fact there can be less groups than expected
        like in data\global\tiles\act1\outdoors\trees.ds1, where the file
        stop right after the last tile_x group data, leaving the other
        datas unknown (tile_y, width, height), and npc paths unknown */

        if ( (info.version >= 12)&&((info.tag_type == 1) || (info.tag_type == 2)))
        {
            // skip 1 dword ?
            if (info.version >= 18){
                buffer.get(new byte[4]);
            }

            int n = info.group_num = buffer.getInt();
            System.out.println("Groups: "+n);

            // malloc
            info.group = new GroupInfo[info.group_num];
            for (int i=0;i<info.group_num;i++){
                info.group[i] = new GroupInfo();
            }
            // fill it
            for (int x=0; x<n; x++)
            {
                info.group[x].tile_x = buffer.getInt();
                info.group[x].tile_y = buffer.getInt();
                info.group[x].width  = buffer.getInt();
                info.group[x].height = buffer.getInt();
                if (info.version >= 13)
                {
                    info.group[x].unk = buffer.getInt();
                }
            }
        }

        boolean obj_path_warn_wrote=false;
        // now we're on the npc's paths datas
        if (info.version >= 14)
        {
            int npc = buffer.getInt();
            //System.out.println("Npc: "+npc);
            for (int n=0; n<npc; n++)
            {
                int path = buffer.getInt();
                int x = buffer.getInt();
                int y = buffer.getInt();

                // search of which object are these paths datas
                int o, last_o, nb;
                o = last_o = nb = 0;
                boolean done = false;
                while (! done)
                {
                    if (o < info.obj_num)
                    {
                        if ((info.obj[o].x == x) && (info.obj[o].y == y))
                        {
                            last_o = o;
                            nb++;
                            if (nb >= 2)
                                done = true;
                        }
                        o++; // next object
                    }
                    else
                        done = true;
                }

                if (nb >= 2)
                {
                    // there are a least 2 objects at the same coordinates

                    // put a warning
                    if (!obj_path_warn_wrote)
                    {
                        obj_path_warn_wrote = true;
                        System.out.println("WARNING, there are at least 2 objects at the same coordinates for some paths datas");
                    }
                    System.out.printf("Removing %d paths points of 1 object at coordinates (%d, %d)\n", path, x, y);


                    // first, delete already assigned paths
                    for (o=0; o < info.obj_num; o++)
                    {
                        if ((info.obj[o].x == x) && (info.obj[o].y == y) &&
                                (info.obj[o].path_num != 0))
                        {
                            for (p=0; p < info.obj[o].path_num; p++)
                            {
                                info.obj[o].path[p].x      = 0;
                                info.obj[o].path[p].y      = 0;
                                info.obj[o].path[p].action = 0;
                                info.obj[o].path[p].flags  = 0;
                            }
                            info.obj[o].path_num = 0;
                        }
                    }

                    // now, skip these paths
                    if (info.version >= 15)
                    {
                        for (p=0; p < path; p++)
                            buffer.get(new byte[3]);
                    }
                    else
                    {
                        for (p=0; p < path; p++)
                            buffer.get(new byte[2]);
                    }
                }
                else
                {
                    // only 1 object at these coordinates for paths, it's ok
                    o = last_o;

                    // does these paths are pointing to a valid object position ?
                    if (o >= info.obj_num)
                    {
                        // nope
                        // the game don't alert the user, so why me ?
                        // but we'll skip them
                        if (info.version >= 15)
                        {
                            for (p=0; p < path; p++)
                                buffer.get(new byte[3]);
                        }
                        else
                        {
                            for (p=0; p < path; p++)
                                buffer.get(new byte[2]);
                        }
                    }
                    else
                    {
                        // yep, valid object
                        // all ok for assigning the paths to this object
                        info.obj[o].path_num = path;
                        for (p=0; p < path; p++)
                        {
                            info.obj[o].path[p].x = buffer.getInt();
                            info.obj[o].path[p].y = buffer.getInt();
                            if (info.version >= 15)
                            {
                                info.obj[o].path[p].action = buffer.getInt();
                            }
                            else
                                info.obj[o].path[p].action = 1; // default action
                        }
                    }
                }
            }
        }
        return info;
    }

    private static class FileByteBuffer{

        private final RandomAccessFile file;
        private final ByteBuffer buffer;

        public FileByteBuffer(RandomAccessFile in){
            file = in;
            buffer = ByteBuffer.allocate(4);
            buffer.order(ByteOrder.LITTLE_ENDIAN);
        }

        public void get(byte[] bytes) throws IOException {
            file.read(bytes);
        }

        public byte get() throws IOException {
            return file.readByte();
        }

        public int getInt() throws IOException {
            buffer.clear();
            file.read(buffer.array());
            return buffer.getInt();
        }
    }

    private static final CharSequence charSequence = new CharSequence()
    {
        private final char[] charSequence = new char[256];

        {
            try {
                RandomAccessFile charTable = new RandomAccessFile("chartable.txt", "rw");
                for (int i = 0; i < 255; i++) {
                    charSequence[i] = (char) charTable.readByte();
                }
                charTable.close();
            } catch (IOException e) {
                e.printStackTrace();
                System.exit(-1);
            }
        }

        @Override
        public int length() {
            return charSequence.length;
        }

        @Override
        public char charAt(int i) {
            return charSequence[i];
        }

        @Override
        public CharSequence subSequence(int i, int i2) {
            return null;
        }
    };
}