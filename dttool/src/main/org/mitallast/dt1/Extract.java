package org.mitallast.dt1;

import org.mitallast.pallete.PaletteReader;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ArrayList;

public class Extract {
    static {
        System.setProperty("java.awt.headless", "true");
    }
    public static void main(String... args){
        String[] fileNames = new String[]{
            "tiles/ACT1/BARRACKS/basewall.dt1",
            "tiles/ACT1/BARRACKS/floor.dt1",
            "tiles/ACT1/BARRACKS/objects.dt1",
        };
        int i=0;
        for(String fileName: fileNames){
            extract(fileName, String.valueOf(i++));
        }
    }

    public static void extract(String fileName, String dir){
        try {
            new File("output/" + dir).mkdir();
            DtReader reader = new DtReader(new RandomAccessFile(fileName, "r"));
            int[] palette = PaletteReader.getPalette(
                    new RandomAccessFile("palette/ACT1/pal.dat", "r"),
                    new RandomAccessFile("palette/gamma.dat", "r")
            );
            FileHeader fileHeader = reader.getFileHeader();
            fileHeader.blockHeaderList = new ArrayList<BlockHeader>();
            //System.out.println(fileHeader);
            // load block header
            int block_ptr = fileHeader.getBh_ptr();
            for (int nb_block=0;nb_block<fileHeader.getNb_block();nb_block++)
            {
                BlockHeader blockHeader = reader.getBlockHeader(block_ptr);
                blockHeader.subBlockHeaderList = new ArrayList<SubBlockHeader>();
                fileHeader.blockHeaderList.add(blockHeader);
                //System.out.println(blockHeader);
                // load sub block
                int sub_ptr=blockHeader.getData_pointer();
                int orientation = blockHeader.orientation;
                int w = blockHeader.size_x;
                int h = blockHeader.size_y;
                int y_add = 96;
                if ((orientation == 0) || (orientation == 15)) // floor or roof
                {
                    if (blockHeader.size_y!=0)
                    {
                        blockHeader.size_y = - 80;
                        h = 80;
                        y_add = 0;
                    }
                }
                else if (orientation < 15) // upper wall, shadow, special
                {
                    if (blockHeader.size_y!=0)
                    {
                        blockHeader.size_y += 32;
                        h -= 32;
                        y_add = h;
                    }
                }
                if(w<=0 || h<=0) continue;
                System.out.println("create img "+w+" "+h+" ("+blockHeader.size_x+" "+blockHeader.size_y+")");
                BufferedImage bufferedImage = new BufferedImage(w,h, BufferedImage.TYPE_INT_ARGB);
                for(int sub=0;sub<blockHeader.getSub_block();sub++){
                    SubBlockHeader subBlockHeader = reader.getSubBlockHeader(sub_ptr);
                    blockHeader.subBlockHeaderList.add(subBlockHeader);
                    //System.out.println(subBlockHeader);
                    // load tiles
                    int tile_ptr = blockHeader.getData_pointer()+subBlockHeader.getData_offset();
                    byte[] tile = reader.getTile(tile_ptr, subBlockHeader.getSub_length());



                    if(subBlockHeader.getTile_format()==1){
                        draw_sub_tile_isometric(
                                bufferedImage,
                                subBlockHeader.getX_pos(),
                                y_add + subBlockHeader.getY_pos(),
                                tile,
                                palette
                        );
                    }else{
//                        if(block_ptr==2772){
//                            System.out.println(subBlockHeader.getX_pos()+":"+subBlockHeader.getY_pos());
                            draw_sub_tile_normal(
                                    bufferedImage,
                                    subBlockHeader.getX_pos(),
                                    y_add + subBlockHeader.getY_pos(),
                                    tile,
                                    palette
                            );
//                        }
                    }
                    sub_ptr+=SubBlockHeader.BYTE_COUNT;
                }
                File file = new File("output/" + dir +"/"+block_ptr + ".png");
                ImageIO.write(bufferedImage, "png", file);
                block_ptr+=BlockHeader.BYTE_COUNT;
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static FileHeader read(RandomAccessFile dtFile, RandomAccessFile palFile) throws IOException {
        DtReader reader = new DtReader(dtFile);
//        int[] palette = PaletteReader.getPalette(
//                palFile,
//                new RandomAccessFile("palette/gamma.dat", "r")
//        );
        FileHeader fileHeader = reader.getFileHeader();
        fileHeader.blockHeaderList = new ArrayList<BlockHeader>();
        //System.out.println(fileHeader);
        // load block header
        int block_ptr = fileHeader.getBh_ptr();
        for (int nb_block=0;nb_block<fileHeader.getNb_block();nb_block++)
        {
            BlockHeader blockHeader = reader.getBlockHeader(block_ptr);
            blockHeader.offset = block_ptr;
            blockHeader.subBlockHeaderList = new ArrayList<SubBlockHeader>();
            fileHeader.blockHeaderList.add(blockHeader);
            //System.out.println(blockHeader);
            // load sub block
            int sub_ptr=blockHeader.getData_pointer();
//            BufferedImage bufferedImage = new BufferedImage(blockHeader.getSize_x(), blockHeader.getSize_y(), BufferedImage.TYPE_INT_ARGB);
            for(int sub=0;sub<blockHeader.getSub_block();sub++){
                SubBlockHeader subBlockHeader = reader.getSubBlockHeader(sub_ptr);
                blockHeader.subBlockHeaderList.add(subBlockHeader);
                //System.out.println(subBlockHeader);
                // load tiles
//                int tile_ptr = blockHeader.getData_pointer()+subBlockHeader.getData_offset();
//                byte[] tile = reader.getTile(tile_ptr, subBlockHeader.getSub_length());
//                draw_sub_tile_isometric(
//                        bufferedImage,
//                        subBlockHeader.getX_pos(),
//                        subBlockHeader.getY_pos(),
//                        tile,
//                        palette
//                );
                sub_ptr+=SubBlockHeader.BYTE_COUNT;
            }
//            ImageIO.write(bufferedImage, "png", new File("output/" + block_ptr + ".png"));
            block_ptr+=BlockHeader.BYTE_COUNT;
        }
        return fileHeader;
    }

    public static void draw_sub_tile_isometric(BufferedImage dst, int xo, int yo, byte[] data, int[] palette)
    {
        int   x, y=0, n;
        int[] xjump = {14, 12, 10, 8, 6, 4, 2, 0, 2, 4, 6, 8, 10, 12, 14};
        int[] nbpix = {4, 8, 12, 16, 20, 24, 28, 32, 28, 24, 20, 16, 12, 8, 4};

        // 3d-isometric subtile is 256 bytes, no more, no less
        int length = data.length;
        if (length != 256)
            return;

        int dataPtr=0;
        // draw
        while (length > 0)
        {
            x = xjump[y];
            n = nbpix[y];
            length -= n;
            while (n>0)
            {
                int colorIndex = data[dataPtr] & 0xFF;
                int color = palette[colorIndex];
                dst.setRGB(xo + x, yo + y, color);
                dataPtr++;
                x++;
                n--;
            }
            y++;
        }
    }

    public static void draw_sub_tile_normal (BufferedImage dst, int x0, int y0, byte[] data, int[] palette)
    {
        int ptr = 0;
        int  x=0, y=0;
        byte b1, b2;
        int length = data.length;
        // draw
        while (length > 0)
        {
            b1 = data[ptr];
            b2 = data[ptr + 1];
            ptr += 2;
            length -= 2;
            if (b1!=0 || b2!=0)
            {
                x += b1;
                length -= b2;
                while (b2!=0)
                {
                    int colorIndex = data[ptr] & 0xFF;
                    int color = palette[colorIndex];
                    try{
                        dst.setRGB(x0 + x, y0 + y, color);
                    }catch (ArrayIndexOutOfBoundsException e){}
                    ptr++;
                    x++;
                    b2--;
                }
            }
            else
            {
                x = 0;
                y++;
            }
        }
    }
}
