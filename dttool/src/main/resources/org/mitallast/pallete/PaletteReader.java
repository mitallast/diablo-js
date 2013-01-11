package org.mitallast.pallete;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public class PaletteReader {

    public enum GammaCorrection {GC_060, GC_062, GC_064, GC_066, GC_068,
            GC_070, GC_072, GC_074, GC_076, GC_078,
            GC_080, GC_082, GC_084, GC_086, GC_088,
            GC_090, GC_092, GC_094, GC_096, GC_098,
            GC_100,
            GC_110, GC_120, GC_130, GC_140, GC_150,
            GC_160, GC_170, GC_180, GC_190, GC_200,
            GC_210, GC_220, GC_230, GC_240, GC_250,
            GC_260, GC_270, GC_280, GC_290, GC_300
    }

    public enum color{r,g,b}

    public static final GammaCorrection defaultGC = GammaCorrection.GC_140;

    public static int[] getPalette(RandomAccessFile randomAccessFile ) throws IOException {
        randomAccessFile.seek(0);
        int[] palette = new int[256];
        for(int i=0;i<256;i++){
            int color=0xFF000000;
            int b = (randomAccessFile.readByte() >> 2)& 0xFF;
            int r = (randomAccessFile.readByte() >> 2)& 0xFF;
            int g = (randomAccessFile.readByte() >> 2)& 0xFF;
            color |= (r)<<16;
            color |= (g)<<8;
            color |= (b);
            palette[i]=color;
        }
        palette[0]=0x00000000;
        return palette;
    }

    public static int[] getPalette(
            RandomAccessFile paletteFile,
            RandomAccessFile gammaFile
    ) throws IOException {
        byte[][] d2_pal = new byte[256][3];
        int shift=2;
        ByteBuffer buffer = ByteBuffer.allocate(256*3);
        buffer.order(ByteOrder.LITTLE_ENDIAN);
        paletteFile.read(buffer.array());

        for(int i=0;i<256;i++){
            d2_pal[i][color.g.ordinal()] = buffer.get();
            d2_pal[i][color.b.ordinal()] = buffer.get();
            d2_pal[i][color.r.ordinal()] = buffer.get();
        }
        d2_pal[0]=new byte[]{0,0,0};

        int[][] gamma_table=new int[GammaCorrection.values().length][256];
        for(GammaCorrection gc: GammaCorrection.values()){
            for (int i=0; i<256; i++)
            {
                int v = gammaFile.readByte() & 0xFF;
                gamma_table[gc.ordinal()][i] = v;
            }
        }
        int[] palette=new int[256];
        int r,g,b;
        for(int i=0;i<256; i++){
            r = d2_pal[i][color.r.ordinal()] & 0xFF;
            g = d2_pal[i][color.b.ordinal()] & 0xFF;
            b = d2_pal[i][color.g.ordinal()] & 0xFF;
            r = gamma_table[defaultGC.ordinal()][r];
            g = gamma_table[defaultGC.ordinal()][g];
            b = gamma_table[defaultGC.ordinal()][b];
            palette[i]=0xFF000000 | ((r & 0xFF)<<16) | ((g & 0xFF)<<8) | (b & 0xFF);
        }
        palette[0]=0;

        return palette;
    }
}