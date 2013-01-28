package org.mitallast.dt1;

import java.nio.ByteBuffer;
import java.util.List;

/**
 # bytes name            description
 ------- --------------- --------------------------------------------------------
 4       direction       direction
 2       roof_y          # of pixels to the up when drawing the block
 1       sound           sound index when walking / runing
 1       animated        set to 0x01 when floor is animated
 4       size_y          power of 32 pixels
 4       size_x          power of 32 pixels
 4       zeros1          unused
 4       orientation     orientation (islveo's corner prop 1)
 4       main_index      main index
 4       sub_index       sub-index
 4       frame           if floor animated, # of frame else ?
 1       unknown_a       ?
 1       unknown_b       ?
 1       unknown_c       ?
 1       unknown_d       ?
 25      floor_flags     for each sub-tiles from right to left, then bottom to up
 7       zeros2          unused
 4       data_ptr        pointer to sub-block headers
 4       length          length of the sub-blocks
 4       sub_block       number of sub-blocks
 12      zeros3          unused
 */
public class BlockHeader {

    public static final int BYTE_COUNT = 4+2+1+1+4+4+4+4+4+4+4+1+1+1+1+25+7+4+4+4+12;

    public int offset;

    public int    direction;
    public short  roof_y;
    public byte   sound;
    public byte   animated;
    public int    size_y;
    public int    size_x;
    public int    zeros1;
    public int    orientation;
    public int    main_index;
    public int    sub_index;
    public int    frame;
    public byte   unknown_a;
    public byte   unknown_b;
    public byte   unknown_c;
    public byte   unknown_d;
    public byte[] floor_flags=new byte[25];
    public byte[] zeros2=new byte[7];
    public int    data_pointer;
    public int    length;
    public int    sub_block;
    public byte[] zeros3=new byte[12];

    public List<SubBlockHeader> subBlockHeaderList;

    public void fromByteBuffer(ByteBuffer buffer){
        direction = buffer.getInt();
        roof_y = buffer.getShort();
        sound = buffer.get();
        animated = buffer.get();
        size_y = buffer.getInt();
        if(size_y<=0)size_y=-size_y;
        size_x = buffer.getInt();
        zeros1 = buffer.getInt();
        orientation = buffer.getInt();
        main_index = buffer.getInt();
        sub_index = buffer.getInt();
        frame = buffer.getInt();
        unknown_a = buffer.get();
        unknown_b = buffer.get();
        unknown_c = buffer.get();
        unknown_d = buffer.get();
        buffer.get(floor_flags);
        buffer.get(zeros2);
        data_pointer = buffer.getInt();
        length = buffer.getInt();
        sub_block = buffer.getInt();
        buffer.get(zeros3);
    }

    public int getDirection() {
        return direction;
    }

    public void setDirection(int direction) {
        this.direction = direction;
    }

    public short getRoof_y() {
        return roof_y;
    }

    public void setRoof_y(short roof_y) {
        this.roof_y = roof_y;
    }

    public byte getSound() {
        return sound;
    }

    public void setSound(byte sound) {
        this.sound = sound;
    }

    public byte getAnimated() {
        return animated;
    }

    public void setAnimated(byte animated) {
        this.animated = animated;
    }

    public int getSize_y() {
        return size_y;
    }

    public void setSize_y(int size_y) {
        this.size_y = size_y;
    }

    public int getSize_x() {
        return size_x;
    }

    public void setSize_x(int size_x) {
        this.size_x = size_x;
    }

    public int getZeros1() {
        return zeros1;
    }

    public void setZeros1(int zeros1) {
        this.zeros1 = zeros1;
    }

    public int getOrientation() {
        return orientation;
    }

    public void setOrientation(int orientation) {
        this.orientation = orientation;
    }

    public int getMain_index() {
        return main_index;
    }

    public void setMain_index(int main_index) {
        this.main_index = main_index;
    }

    public int getSub_index() {
        return sub_index;
    }

    public void setSub_index(int sub_index) {
        this.sub_index = sub_index;
    }

    public int getFrame() {
        return frame;
    }

    public void setFrame(int frame) {
        this.frame = frame;
    }

    public byte getUnknown_a() {
        return unknown_a;
    }

    public void setUnknown_a(byte unknown_a) {
        this.unknown_a = unknown_a;
    }

    public byte getUnknown_b() {
        return unknown_b;
    }

    public void setUnknown_b(byte unknown_b) {
        this.unknown_b = unknown_b;
    }

    public byte getUnknown_c() {
        return unknown_c;
    }

    public void setUnknown_c(byte unknown_c) {
        this.unknown_c = unknown_c;
    }

    public byte getUnknown_d() {
        return unknown_d;
    }

    public void setUnknown_d(byte unknown_d) {
        this.unknown_d = unknown_d;
    }

    public byte[] getFloor_flags() {
        return floor_flags;
    }

    public void setFloor_flags(byte[] floor_flags) {
        this.floor_flags = floor_flags;
    }

    public byte[] getZeros2() {
        return zeros2;
    }

    public void setZeros2(byte[] zeros2) {
        this.zeros2 = zeros2;
    }

    public int getData_pointer() {
        return data_pointer;
    }

    public void setData_pointer(int data_pointer) {
        this.data_pointer = data_pointer;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public int getSub_block() {
        return sub_block;
    }

    public void setSub_block(int sub_block) {
        this.sub_block = sub_block;
    }

    public byte[] getZeros3() {
        return zeros3;
    }

    public void setZeros3(byte[] zeros3) {
        this.zeros3 = zeros3;
    }

    public String toJson() {
        StringBuilder builder = new StringBuilder();
        builder.append(offset).append(":{")
                .append("orientation:").append(orientation)
                .append(", main_index:").append(main_index)
                .append(", sub_index:").append(sub_index)
                .append(", direction:").append(direction);
        builder.append(", walk:[");
        for(byte flags: floor_flags){
            if((flags & 0x01) == 0){
                builder.append("0,");
            }else{
                builder.append("1,");
            }
        }
        builder.append("]");
        builder.append('}');
        return builder.toString();
    }

    @Override
    public String toString() {
        return "BlockHeader{" +
                "orientation=" + orientation +
                ", main_index=" + main_index +
                ", sub_index=" + sub_index +
                ", frame=" + frame +
                ", roof_y=" + roof_y +
                ", sub_block=" + sub_block +
                ", direction=" + direction +
                ", sound=" + sound +
                ", animated=" + animated +
                ", size_y=" + size_y +
                ", size_x=" + size_x +
                ", zeros1=" + zeros1 +
                ", unknown_a=" + unknown_a +
                ", unknown_b=" + unknown_b +
                ", unknown_c=" + unknown_c +
                ", unknown_d=" + unknown_d +
                ", floor_flags=" + floor_flags +
                ", zeros2=" + zeros2 +
                ", data_pointer=" + data_pointer +
                ", length=" + length +
                ", zeros3=" + zeros3 +
                '}';
    }
}
