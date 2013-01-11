package org.mitallast.ds1;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public class DsReader {

    public static final int FLOOR_MAX_LAYER=2;
    public static final int SHADOW_MAX_LAYER=1;
    public static final int TAG_MAX_LAYER=1;
    public static final int WALL_MAX_LAYER=4;

    public static void main(String... args) throws IOException {
        read(new RandomAccessFile("tiles/ACT1/TOWN/townE1.ds1", "r"));
    }

    public static void read(RandomAccessFile in) throws IOException {

        byte [] dir_lookup = new byte[]{
            0x00, 0x01, 0x02, 0x01, 0x02, 0x03, 0x03, 0x05, 0x05, 0x06,
                    0x06, 0x07, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E,
                    0x0F, 0x10, 0x11, 0x12, 0x14};

        in.seek(0);
//        ByteBuffer buffer = ByteBuffer.allocate((int) in.length());
        FileByteBuffer buffer = new FileByteBuffer(in);

        DsInfo info = new DsInfo();

        info.version = buffer.getInt();
        info.width = buffer.getInt();
        info.height = buffer.getInt();
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

//        int MAX_LAYER = (info.wall_num * 2) + info.floor_num + info.shadow_num + info.tag_num;

        // read tiles of layers

        // floor buffer
        info.floor_line     = info.width * info.floor_num;
        info.floor_len      = info.floor_line * info.height;
        info.floor_buff     = new DsLayerInfo[info.floor_len];
        for (int i=0;i<info.floor_len;i++){
            info.floor_buff[i]=new DsLayerInfo();
        }

        // shadow buffer
        info.shadow_line     = info.width * info.shadow_num;
        info.shadow_len      = info.shadow_line * info.height;
        info.shadow_buff     = new DsLayerInfo[info.shadow_len];
        for (int i=0;i<info.shadow_len;i++){
            info.shadow_buff[i]=new DsLayerInfo();
        }

        // tag buffer
        info.tag_line     = info.width * info.tag_num;
        info.tag_len      = info.tag_line * info.height;
        info.tag_buff     = new DsLayerInfo[info.tag_len];
        for (int i=0;i<info.tag_len;i++){
            info.tag_buff[i]=new DsLayerInfo();
        }

        // wall buffer
        info.wall_line     = info.width * info.wall_num;
        info.wall_len      = info.wall_line * info.height;
        info.wall_buff     = new DsLayerInfo[info.wall_len];
        for (int i=0;i<info.wall_len;i++){
            info.wall_buff[i]=new DsLayerInfo();
        }

        int[] f_ptr=new int[FLOOR_MAX_LAYER];
        int[] s_ptr=new int[SHADOW_MAX_LAYER];
        int[] t_ptr=new int[TAG_MAX_LAYER];
        int[] w_ptr=new int[WALL_MAX_LAYER];
        int[] o_ptr=new int[WALL_MAX_LAYER];

        // set pointers
        for (int x=0; x<FLOOR_MAX_LAYER; x++)
            f_ptr[x] = x;

        for (int x=0; x<SHADOW_MAX_LAYER; x++)
            s_ptr[x] = x;

        for (int x=0; x<TAG_MAX_LAYER; x++)
            t_ptr[x] = x;

        for (int x=0; x<WALL_MAX_LAYER; x++)
            o_ptr[x] = w_ptr[x] = x;

        int p;
        for (int n=0; n < nb_layer; n++)
        {
            for (int y=0; y < info.height; y++)
            {
                for (int x=0; x < info.width; x++)
                {
                    System.out.printf("n:%d y:%d x:%d ", n, y, x);
                    switch (lay_stream[n])
                    {
                        // walls
                        case  1:
                        case  2:
                        case  3:
                        case  4:
                            p = lay_stream[n] - 1;
                            info.wall_buff[w_ptr[p]].prop1 = buffer.get();
                            info.wall_buff[w_ptr[p]].prop2 = buffer.get();
                            info.wall_buff[w_ptr[p]].prop3 = buffer.get();
                            info.wall_buff[w_ptr[p]].prop4 = buffer.get();
                            System.out.println(info.wall_buff[w_ptr[p]]);
                            w_ptr[p] += info.wall_num;
                            break;

                        // orientations
                        case  5:
                        case  6:
                        case  7:
                        case  8:
                            p = lay_stream[n] - 5;
                            if (info.version < 7)
                                info.wall_buff[o_ptr[p]].orientation = dir_lookup[buffer.get()&0xFF];
                            else{
                                info.wall_buff[o_ptr[p]].orientation = buffer.get();
                            }
                            System.out.println(info.wall_buff[o_ptr[p]]);
                            o_ptr[p] += info.wall_num;
                            break;
                        // floors
                        case  9:
                        case 10:
                            p = lay_stream[n] - 9;
                            info.floor_buff[f_ptr[p]].prop1 = buffer.get();
                            info.floor_buff[f_ptr[p]].prop2 = buffer.get();
                            info.floor_buff[f_ptr[p]].prop3 = buffer.get();
                            info.floor_buff[f_ptr[p]].prop4 = buffer.get();
                            System.out.println(info.floor_buff[f_ptr[p]]);
                            f_ptr[p] += info.floor_num;
                            break;
                        // shadow
                        case 11:
                            p = lay_stream[n] - 11;
                            info.shadow_buff[s_ptr[p]].prop1 = buffer.get();
                            info.shadow_buff[s_ptr[p]].prop2 = buffer.get();
                            info.shadow_buff[s_ptr[p]].prop3 = buffer.get();
                            info.shadow_buff[s_ptr[p]].prop4 = buffer.get();
                            System.out.println(info.shadow_buff[s_ptr[p]]);
                            s_ptr[p] += info.shadow_num;
                            break;

                        // tag
                        case 12:
                            p = lay_stream[n] - 12;
                            info.tag_buff[t_ptr[p]].num = buffer.get();
                            System.out.println(info.tag_buff[t_ptr[p]]);
                            t_ptr[p] += info.tag_num;
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
            System.out.println("objects: "+info.obj_num);

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
                System.out.println(info.group[x]);
            }
        }

        System.out.println(info);
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

    private static final CharSequence charSequence = new CharSequence() {
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
