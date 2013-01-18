package org.mitallast.dt1;

import java.nio.ByteBuffer;
import java.util.List;

/**
 # bytes name            description
 ------- --------------- --------------------------------------------
 4       x1              version (= 7)
 4       x2              version (= 6)
 260     zeros1          unused
 4       nb_block        # of blocks
 4       bh_ptr          pointer in file to block headers (= 0x114)
 */
public class FileHeader {

    public static final int BYTE_COUNT=4+4+260+4+4;

    private int x1;
    private int x2;
    private byte[] zeros1=new byte[260];
    private int nb_block;
    private int bh_ptr;

    public List<BlockHeader> blockHeaderList;

    public void fromByteBuffer(ByteBuffer buffer){
        x1 = buffer.getInt();
        x2 = buffer.getInt();
        buffer.get(zeros1);
        nb_block = buffer.getInt();
        bh_ptr = buffer.getInt();
    }

    public int getX1() {
        return x1;
    }

    public void setX1(int x1) {
        this.x1 = x1;
    }

    public int getX2() {
        return x2;
    }

    public void setX2(int x2) {
        this.x2 = x2;
    }

    public byte[] getZeros1() {
        return zeros1;
    }

    public void setZeros1(byte[] zeros1) {
        this.zeros1 = zeros1;
    }

    public int getNb_block() {
        return nb_block;
    }

    public void setNb_block(int nb_block) {
        this.nb_block = nb_block;
    }

    public int getBh_ptr() {
        return bh_ptr;
    }

    public void setBh_ptr(int bh_ptr) {
        this.bh_ptr = bh_ptr;
    }

    @Override
    public String toString() {
        return "FileHeader{" +
                "x1=" + x1 +
                ", x2=" + x2 +
                ", zeros1=" + zeros1 +
                ", nb_block=" + nb_block +
                ", bh_ptr=" + bh_ptr +
                '}';
    }
}
