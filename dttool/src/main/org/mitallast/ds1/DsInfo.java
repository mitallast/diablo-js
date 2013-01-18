package org.mitallast.ds1;

import java.util.Arrays;

/**
 DS1_INFO
 ========
 + 00  dword  UNK_TYPE      : type of the unknown layer
 0 means no unknown layer and no unknown datas between the
 Objects and Paths datas.
 1 or 2 means there's such datas.
 + 04  dword  DS1_PTR       : DS1 file pointer in heap
 + 08  dword  ?             : unused
 + 0C  dword  WIDTH         : in # of tiles
 + 10  dword  HEIGHT        : in # of tiles
 + 14  dword  WALL_NUM      : # of walls layers
 + 18  dword  FLOOR_NUM     : # of floor layers
 + 1C  dword  OFF_DIR_1     : pointer to direction layer 1
 + 20  dword  OFF_DIR_2     : pointer to direction layer 2
 + 24  dword  OFF_DIR_3     : pointer to direction layer 3
 + 28  dword  OFF_DIR_4     : pointer to direction layer 4
 + 2C  dword  OFF_WALL_1    : pointer to wall layer 1
 + 30  dword  OFF_WALL_2    : pointer to wall layer 2
 + 34  dword  OFF_WALL_3    : pointer to wall layer 3
 + 38  dword  OFF_WALL_4    : pointer to wall layer 4
 + 3C  dword  OFF_FLOOR_1   : pointer to floor layer 1
 + 40  dword  OFF_FLOOR_2   : pointer to floor layer 2
 + 44  dword  OFF_SHAD      : pointer to shadow layer
 + 48  dword  OFF_UNK       : pointer to unknown layer (something to make groups of tiles I think)
 + 4C  dword  UNK_NUM       : # of lines in the unknown datas, something to do with the Unknown layer
 + 50  dword  UNK_PTR       : pointer for storing these unknown lines, table of UNK_NUM elements of UNK_STRUCT
 + 54  dword  START_OBJ_PTR : pointer to 1st element of the linked OBJECT structures
 */
public class DsInfo {

    int version;
    int width;
    int height;
    int act;
    int tag_type;

    int file_num;
    String[] files;


    int wall_num =0;
    int floor_num =0;
    int tag_num =0;
    int shadow_num =1;

    // {layer num, x, y}
    DsLayerInfo[][][] wall_buff;
    DsLayerInfo[][][] floor_buff;
    DsLayerInfo[][][] tag_buff;
    DsLayerInfo[][][] shadow_buff;

    int obj_num;
    ObjectInfo[] obj;

    int group_num;
    GroupInfo[] group;

    @Override
    public String toString() {
        return "DsInfo{" +
                "version=" + version +
                ", width=" + width +
                ", height=" + height +
                ", act=" + act +
                ", tag_type=" + tag_type +
                ", file_num=" + file_num +
                ", files=" + (files == null ? null : Arrays.asList(files)) +
                ", wall_num=" + wall_num +
                ", floor_num=" + floor_num +
                ", tag_num=" + tag_num +
                ", shadow_num=" + shadow_num +
                '}';
    }
}
