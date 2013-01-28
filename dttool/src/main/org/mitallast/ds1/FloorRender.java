package org.mitallast.ds1;

import org.mitallast.dt1.BlockHeader;
import org.mitallast.dt1.Extract;
import org.mitallast.dt1.FileHeader;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.LinkedList;

public class FloorRender {
    public static void main(String... args) throws IOException {
        FileHeader floorHeader = Extract.read(
                new RandomAccessFile("tiles/ACT1/BARRACKS/floor.dt1", "r"),
                new RandomAccessFile("palette/ACT1/pal.dat", "r")
        );
        FileHeader basewallHeader = Extract.read(
                new RandomAccessFile("tiles/ACT1/BARRACKS/basewall.dt1", "r"),
                new RandomAccessFile("palette/ACT1/pal.dat", "r")
        );
        FileHeader objectsHeader = Extract.read(
                new RandomAccessFile("tiles/ACT1/BARRACKS/objects.dt1", "r"),
                new RandomAccessFile("palette/ACT1/pal.dat", "r")
        );
        FileHeader merged = merge(floorHeader,basewallHeader,objectsHeader);
        DsInfo dsInfo = DsReader.read(
                new RandomAccessFile("tiles/ACT1/BARRACKS/barE.ds1", "r")
        );
        System.out.println("width="+dsInfo.width+" height="+dsInfo.height);

        renderLayer(dsInfo.floor_buff[0], floorHeader,0);
        renderLayer(dsInfo.wall_buff[0], objectsHeader,1);
    }

    public static FileHeader merge(FileHeader... headers){
        FileHeader merged=new FileHeader();
        merged.blockHeaderList=new LinkedList<BlockHeader>();
        for(FileHeader header: headers){
            for(BlockHeader blockHeader: header.blockHeaderList){
                merged.blockHeaderList.add(blockHeader);
            }
        }
        return merged;
    }

    public static void renderLayer(DsLayerInfo[][] layer, FileHeader fileHeader, int type) throws IOException{
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
            case 2:
                floor = searchShadow(layer, fileHeader);
                break;
            default:
                throw new UnsupportedOperationException("undefined type");
        }
        for (int[] aFloor : floor) {
            System.out.print("[");
            for (int anAFloor : aFloor) {
                System.out.printf("%4s,", anAFloor);
            }
            System.out.println("],");
        }
    }

    public static int[][] searchShadow(DsLayerInfo[][] layer, FileHeader fileHeader){
        int[][] floor = new int[layer[0].length][layer.length];
        for(int x=0;x<layer.length;x++){
            for (int y=0;y<layer[x].length;y++){
                DsLayerInfo layerInfo = layer[x][y];
                int main_index, sub_index;
                if (layerInfo.prop1 == 0) continue;
                main_index  = ((layerInfo.prop3 >> 4)&0x0F + ((layerInfo.prop4 & 0x03) << 4));
                sub_index   = layerInfo.prop2;
                //System.out.println("Search "+main_index+" "+sub_index);
                for(BlockHeader blockHeader: fileHeader.blockHeaderList){
//                    System.out.println("Test "+blockHeader.orientation+" "+blockHeader.main_index+" "+blockHeader.sub_index);
                    if ( (blockHeader.orientation == 13) &&
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

    public static int[][] searchWall(DsLayerInfo[][] layer, FileHeader fileHeader){
        int[][] floor = new int[layer[0].length][layer.length];
        for(int x=0;x<layer.length;x++){
            for (int y=0;y<layer[x].length;y++){
                DsLayerInfo layerInfo = layer[x][y];
                int main_index, sub_index;
                if (layerInfo.prop1 == 0) continue;
                main_index  = ((layerInfo.prop3 >> 4)&0x0F + ((layerInfo.prop4 & 0x03) << 4));
                sub_index   = layerInfo.prop2;
                //System.out.println("Search "+layerInfo.orientation+" "+main_index+" "+sub_index);
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
                //System.out.println("Search "+main_index+" "+sub_index);
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
