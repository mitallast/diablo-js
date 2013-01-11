package org.mitallast.dt1;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public class DtReader {
    private RandomAccessFile file;

    public DtReader(RandomAccessFile file) {
        this.file = file;
    }

    public FileHeader getFileHeader() throws IOException {
        FileHeader fileHeader = new FileHeader();
        ByteBuffer buffer = ByteBuffer.allocate(FileHeader.BYTE_COUNT);
        buffer.order(ByteOrder.LITTLE_ENDIAN);
        file.seek(0);
        file.read(buffer.array());
        fileHeader.fromByteBuffer(buffer);
        return fileHeader;
    }

    public BlockHeader getBlockHeader(int ptr) throws IOException {
        BlockHeader blockHeader = new BlockHeader();
        ByteBuffer buffer = ByteBuffer.allocate(BlockHeader.BYTE_COUNT);
        buffer.order(ByteOrder.LITTLE_ENDIAN);
        file.seek(ptr);
        file.read(buffer.array());
        blockHeader.fromByteBuffer(buffer);
        return blockHeader;
    }

    public SubBlockHeader getSubBlockHeader(int ptr) throws IOException {
        SubBlockHeader subBlockHeader = new SubBlockHeader();
        ByteBuffer buffer = ByteBuffer.allocate(SubBlockHeader.BYTE_COUNT);
        buffer.order(ByteOrder.LITTLE_ENDIAN);
        file.seek(ptr);
        file.read(buffer.array());
        subBlockHeader.fromByteBuffer(buffer);
        return subBlockHeader;
    }

    public byte[] getTile(int ptr, int length) throws IOException {
        file.seek(ptr);
        byte[] data = new byte[length];
        file.read(data);
        return data;
    }
}
