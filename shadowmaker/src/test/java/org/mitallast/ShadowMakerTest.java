package org.mitallast;

import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;
import java.net.URL;

public class ShadowMakerTest extends Assert{
    @Test
    public void testProcessImage() throws IOException {
        URL in = ShadowMakerTest.class.getResource("test.png");
        URL out = ShadowMakerTest.class.getResource("out.png");
        assertNotNull(in);
        assertNotNull(out);
        System.out.println(in.getFile());
        System.out.println(out.getFile());
        ShadowMaker.processImage(
                in.getFile(),
                out.getFile()
        );
    }
}
