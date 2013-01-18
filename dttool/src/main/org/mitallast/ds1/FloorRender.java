package org.mitallast.ds1;

import org.mitallast.dt1.BlockHeader;
import org.mitallast.dt1.Extract;
import org.mitallast.dt1.FileHeader;

import java.io.IOException;
import java.io.RandomAccessFile;

public class FloorRender {
    public static void main(String... args) throws IOException {
        DsInfo dsInfo = DsReader.read(
                new RandomAccessFile("tiles/ACT1/BARRACKS/barE.ds1", "r")
        );
        System.out.println("width="+dsInfo.width+" height="+dsInfo.height);
//        DsInfo dsInfo = new SimpleReader(new RandomAccessFile("tiles/ACT1/TOWN/townE1.ds1", "r")).read();
        for(String file: dsInfo.files){
            System.out.println(file);
        }
//        String[] fileNames = new String[]{
////            "tiles/ACT1/BARRACKS/basewall.dt1",
//            "tiles/ACT1/BARRACKS/floor.dt1",
////            "tiles/ACT1/BARRACKS/objects.dt1",
//            //"tiles/ACT1/BARRACKS/barset.dt1",
//        };
        renderLayer(dsInfo.floor_buff[0], "tiles/ACT1/BARRACKS/floor.dt1",0);
        renderLayer(dsInfo.wall_buff[0], "tiles/ACT1/BARRACKS/basewall.dt1",1);
//        renderLayer(dsInfo.floor_buff[1], "tiles/ACT1/BARRACKS/floor.dt1");
//        renderLayer(dsInfo.wall_buff[1], "tiles/ACT1/BARRACKS/objects.dt1");
    }

    public static void renderLayer(DsLayerInfo[][] layer, String fileName, int type) throws IOException{
        System.out.println("Read dt1 "+fileName.hashCode());
        FileHeader fileHeader = Extract.read(
                new RandomAccessFile(fileName, "r"),
                new RandomAccessFile("palette/ACT1/pal.dat", "r")
        );
        for(BlockHeader blockHeader: fileHeader.blockHeaderList){
            System.out.println(blockHeader.toJson()+",");
        }
        int[][] floor;
        switch (type){
            case 0:
                floor = searchFloor(layer, fileHeader);
                break;
            case 1:
                floor = searchWall(layer, fileHeader);
                break;
            default:
                throw new UnsupportedOperationException("undefined type");
        }
        for(int x=0;x<floor.length;x++){
            System.out.print("[");
            for(int y=0;y<floor[x].length;y++){
                System.out.printf("%4s,", floor[x][y]);
            }
            System.out.println("],");
        }
    }

    public static int[][] searchWall(DsLayerInfo[][] layer, FileHeader fileHeader){
        int[][] floor = new int[layer[0].length][layer.length];
        for(int x=0;x<layer.length;x++){
            for (int y=0;y<layer[x].length;y++){
                DsLayerInfo layerInfo = layer[x][y];
                int main_index, sub_index;
                if (layerInfo.prop1 == 0) continue;
                main_index  = ((layerInfo.prop3 >> 4)&0x0F + ((layerInfo.prop4 & 0x03) << 4));
                sub_index   = layerInfo.prop2;
//                if(layerInfo.orientation==3){
//                    layerInfo.orientation=4;
//                }
//                System.out.println("Search "+layerInfo.orientation+" "+main_index+" "+sub_index);
                for(BlockHeader blockHeader: fileHeader.blockHeaderList){
//                    System.out.println("Test "+blockHeader.orientation+" "+blockHeader.main_index+" "+blockHeader.sub_index);
                    if ( (blockHeader.orientation == layerInfo.orientation) &&
                            (blockHeader.main_index  == main_index) &&
                            (blockHeader.sub_index   == sub_index)
                            ){
//                        System.out.println("Found "+blockHeader.offset);
                        floor[y][x]=blockHeader.offset;
                        break;
                    }
                }
            }
        }
        return floor;
    }
    public static int[][] searchFloor(DsLayerInfo[][] layer, FileHeader fileHeader){
        int[][] floor = new int[layer[0].length][layer.length];
        for(int x=0;x<layer.length;x++){
            for (int y=0;y<layer[x].length;y++){
                DsLayerInfo layerInfo = layer[x][y];
                int main_index, sub_index;
                //if (layerInfo.prop1 == 0) continue;
                main_index  = ((layerInfo.prop3 >> 4)&0x0F + ((layerInfo.prop4 & 0x03) << 4));
                sub_index   = layerInfo.prop2;
//                System.out.println("Search "+main_index+" "+sub_index);
                for(BlockHeader blockHeader: fileHeader.blockHeaderList){
//                    System.out.println("Test "+blockHeader.main_index+" "+blockHeader.sub_index);
                    if ( (blockHeader.orientation == 0)          &&
                            (blockHeader.main_index  == main_index) &&
                            (blockHeader.sub_index   == sub_index)
                            ){
//                        System.out.println("Found "+blockHeader);
                        floor[y][x]=blockHeader.offset;
                        break;
                    }
                }
            }
        }
        return floor;
    }
}
