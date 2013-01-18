package org.mitallast.ds1;

/**
 OBJECT
 ======
 (I'm not sure for these 3 first datas)
 + 00  dword  ID      ? : original ID
 + 04  dword  NEW_ID  ? : new ID after possible modifications
 + 08  dword  VERSION ? : version of the ds1

 + 0C  dword  OBJ_X     : X coordinate in # of sub-tiles
 + 10  dword  OBJ_Y     : Y coordinate in # of sub-tiles
 + 14  dword  FLAGS     : flags of this object
 + 18  dword  PATH_PTR  : pointer to a simple PATHS_INFO structure, NULL if no paths for this object
 + 1C  dword  NEXT_PTR  : pointer to next OBJECT in the linked list, NULL if none
 */
public class ObjectInfo {

    public static final int WINDS1EDIT_PATH_MAX = 100;

    int        type;
    int        id;
    int        x;     // sub-cell X
    int        y;     // sub-cell Y
    int        ds1_flags;

    int        path_num;
    PathInfo[] path = new PathInfo[WINDS1EDIT_PATH_MAX];
    int         desc_idx;
    int         flags;
    //OBJ_LABEL_S label;

    // for moving
//    int         old_x;
//    int         old_y;
//
//    // for sorting
//    int        tx; // tile X
//    int        ty; // tile Y
//    int        sx; // sub-tile X
//    int        sy; // sub-tile Y
//
//    // random starting animation frame
//    byte        frame_delta;


    @Override
    public String toString() {
        return "ObjectInfo{" +
                "type=" + type +
                ", id=" + id +
                ", x=" + x +
                ", y=" + y +
                ", ds1_flags=" + ds1_flags +
                ", path_num=" + path_num +
                ", desc_idx=" + desc_idx +
                ", flags=" + flags +
                '}';
    }
}
