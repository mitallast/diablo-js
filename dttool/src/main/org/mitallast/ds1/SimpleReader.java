package org.mitallast.ds1;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Arrays;

/// <summary>
/// I would like to give credits to Paul Siramy wich is probably the most influent person in d2 modding community
/// references: http://phrozenkeep.planetdiablo.gamespy.com/forum/viewtopic.php?t=724
/// http://phrozenkeep.planetdiablo.gamespy.com/forum/viewtopic.php?p=46314
/// </summary>
public class SimpleReader {

    public static void main(String... args){
        try {
            new SimpleReader(new RandomAccessFile("tiles/ACT1/BARRACKS/barE.ds1", "r"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private final RandomAccessFile file;
    private final ByteBuffer intBuffer;

    private int readInt(){
        int v=0;
        intBuffer.clear();
        try {
            file.read(intBuffer.array());
            v=intBuffer.getInt();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return v;
    }

    public SimpleReader(RandomAccessFile file) throws IOException {
        this.file = file;
        intBuffer = ByteBuffer.allocate(4);
        intBuffer.order(ByteOrder.LITTLE_ENDIAN);
        init();
    }

    private void init() throws IOException {
        Version = readInt();
        if (Version >= 16)
        {
            //read the header data
            Width = readInt();
            Height = readInt();
            Act = readInt();
            Unknown2 = readInt();
            NumFiles = readInt();
            //read the file(s) path of .dt1 and tg1 used
            System.out.println("NumFiles "+NumFiles);
            for (int i = 0; i < 3; i++){
                StringBuffer stringBuffer = new StringBuffer();
                int symbol;
                do{
                    symbol = file.readByte() & 0xFF;
                    stringBuffer.append(charSequence.charAt(symbol));
                }while (symbol!=0);
                System.out.println("File #"+i);
                System.out.println(stringBuffer);
            }
            NumWall = readInt();
            NumFloor = readInt();
            MaxLayer = (NumWall * 2) + NumFloor + 1;//this is ok?
            byte[] buf = new byte[4];

            //there might be an error with some .ds1 that require an extra unknown layer
            //read each Layers and add them in Layers list
            for (int i = 0; i < MaxLayer; i++)
            {
                Layer currLayer = new Layer(Width, Height);
                for (int y = 0; y < Height + 1; y++)
                {
                    for (int x = 0; x < Width + 1; x++)
                    {
                        file.read(buf);
                        currLayer.Property0[x][y] = buf[0];
                        currLayer.Property1[x][y] = buf[1];
                        currLayer.Property2[x][y] = buf[2];
                        currLayer.Property3[x][y] = buf[3];
                    }
                }
                //System.out.println(currLayer);
            }

            //once this is done it should be at the right index to start reading objects
            NumObjects = readInt();
            System.out.println("NumObjects: "+NumObjects);
            int dw0, dw1, dw2, dw3, dw4;
            for (int i = 0; i < NumObjects; i++)
            {
                dw0 = readInt();
                dw1 = readInt();
                dw2 = readInt();
                dw3 = readInt();
                dw4 = readInt();
                Object object = new Object(dw0, dw1, dw2, dw3, dw4);
                System.out.println(object);
            }
            int breakdasfds = 0;
            //done, if you want to read NPCPaths, then you will need to implement it
            parsed = true;
            System.out.println(this);
        }
    }
    //objects
    int NumObjects;

    //other
    boolean parsed = false;
    int MaxLayer;

    //Header
    int Version;
    int Width;
    int Height;
    int Act;
    int Unknown2;
    int NumFiles;
    int NumWall;
    int NumFloor;

    /// <summary>
    /// Represent a layer with 4 property
    /// </summary>
    public class Layer
    {
        public Layer(int width, int height)
        {
            Property0 = new byte[width + 1][height + 1];
            Property1 = new byte[width + 1][height + 1];
            Property2 = new byte[width + 1][height + 1];
            Property3 = new byte[width + 1][height + 1];
        }

        public byte[][] Property0, Property1, Property2, Property3;

        @Override
        public String toString() {
            return "Layer{" +
                    "Property0=" + (Property0 == null ? null : Arrays.asList(Property0)) +
                    ", Property1=" + (Property1 == null ? null : Arrays.asList(Property1)) +
                    ", Property2=" + (Property2 == null ? null : Arrays.asList(Property2)) +
                    ", Property3=" + (Property3 == null ? null : Arrays.asList(Property3)) +
                    '}';
        }
    }

    /// <summary>
    /// represent an object
    /// </summary>
    public class Object
    {
        public Object(int dw0, int dw1, int dw2, int dw3, int dw4)
        {
            this.Type = dw0;
            this.Id = dw1;
            this.X = dw2;
            this.Y = dw3;
            this.Unknown = dw4;
        }

        public int Type, Id, X, Y, Unknown;

        @Override
        public String toString() {
            return "Object{" +
                    "Type=" + Type +
                    ", Id=" + Id +
                    ", X=" + X +
                    ", Y=" + Y +
                    ", Unknown=" + Unknown +
                    '}';
        }
    }

    private static final CharSequence charSequence = new CharSequence() {
        private final char[] charSequence = new char[256];

        {
            RandomAccessFile charTable = null;
            try {
                charTable = new RandomAccessFile("chartable.txt", "rw");
                for(int i=0;i<255;i++){
                    charSequence[i]=(char)charTable.readByte();
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

    @Override
    public String toString() {
        return "SimpleReader{" +
                "file=" + file +
                ", intBuffer=" + intBuffer +
                ", NumObjects=" + NumObjects +
                ", parsed=" + parsed +
                ", MaxLayer=" + MaxLayer +
                ", Version=" + Version +
                ", Width=" + Width +
                ", Height=" + Height +
                ", Act=" + Act +
                ", Unknown2=" + Unknown2 +
                ", NumFiles=" + NumFiles +
                ", NumWall=" + NumWall +
                ", NumFloor=" + NumFloor +
                '}';
    }
}
