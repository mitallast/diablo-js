package org.mitallast.dt1;

import java.nio.ByteBuffer;

/**
 # bytes name            description
 ------- --------------- ---------------------------------------------------------
 2       x_pos           x offset where to draw the sub-tile
 2       y_pos           y offset where to draw the sub-tile
 2       zeros1          unused
 1       grid_x          if sub-tile of floor, its x position in the floor
 1       grid_y          if sub-tile of floor, its y position in the floor
 2       tile_format     method of drawing the sub-tile
 4       sub-length      length of the sub-block data
 2       zeros2          unused
 4       data_offset     pointer FROM SUB-BLOCK HEADER of this datas
 */
public class SubBlockHeader {

    public static final int BYTE_COUNT = 2+2+2+1+1+2+4+2+4;

    private int x_pos;
    private int y_pos;
    private short zeros1;
    private byte grid_x;
    private byte grid_y;
    private short tile_format;
    private int sub_length;
    private short zeros2;
    private int data_offset;

    public void fromByteBuffer(ByteBuffer buffer){
        x_pos = buffer.getShort();
        y_pos = buffer.getShort();
        zeros1 = buffer.getShort();
        grid_x = buffer.get();
        grid_y = buffer.get();
        tile_format = buffer.getShort();
        sub_length = buffer.getInt();
        zeros2 = buffer.getShort();
        data_offset = buffer.getInt();
    }

    public int getX_pos() {
        return x_pos;
    }

    public void setX_pos(short x_pos) {
        this.x_pos = x_pos;
    }

    public int getY_pos() {
        return y_pos;
    }

    public void setY_pos(short y_pos) {
        this.y_pos = y_pos;
    }

    public short getZeros1() {
        return zeros1;
    }

    public void setZeros1(short zeros1) {
        this.zeros1 = zeros1;
    }

    public byte getGrid_x() {
        return grid_x;
    }

    public void setGrid_x(byte grid_x) {
        this.grid_x = grid_x;
    }

    public byte getGrid_y() {
        return grid_y;
    }

    public void setGrid_y(byte grid_y) {
        this.grid_y = grid_y;
    }

    public short getTile_format() {
        return tile_format;
    }

    public void setTile_format(short tile_format) {
        this.tile_format = tile_format;
    }

    public int getSub_length() {
        return sub_length;
    }

    public void setSub_length(int sub_length) {
        this.sub_length = sub_length;
    }

    public short getZeros2() {
        return zeros2;
    }

    public void setZeros2(short zeros2) {
        this.zeros2 = zeros2;
    }

    public int getData_offset() {
        return data_offset;
    }

    public void setData_offset(int data_offset) {
        this.data_offset = data_offset;
    }

    @Override
    public String toString() {
        return "SubBlockHeader{" +
                "x_pos=" + x_pos +
                ", y_pos=" + y_pos +
                ", zeros1=" + zeros1 +
                ", grid_x=" + grid_x +
                ", grid_y=" + grid_y +
                ", tile_format=" + tile_format +
                ", sub_length=" + sub_length +
                ", zeros2=" + zeros2 +
                ", data_offset=" + data_offset +
                '}';
    }
}