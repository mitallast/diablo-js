package org.mitallast;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ShadowMaker {
    static {
        System.setProperty("java.awt.headless", "true");
    }
    public static void main(String... args){
        try {
            processImage(args[0], args[1]);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void processImage(String in, String out) throws IOException {
        File imageFile = new File(in);
        BufferedImage bufferedImage= ImageIO.read(imageFile);
        int width = bufferedImage.getWidth(null);
        int height = bufferedImage.getHeight(null);
        BufferedImage alphaImage = new BufferedImage((width+(height/2)), height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d= alphaImage.createGraphics();
        g2d.drawImage(bufferedImage, (height/2), 0, null);
        g2d.dispose();
        makeShadow(alphaImage);
        ImageIO.write(alphaImage, "png", new File(out));
    }

    public static void makeShadow(BufferedImage image){
        int width = image.getWidth(null);
        int height = image.getHeight(null);
        int pixel;
        int deltaX=0;
        int deltaY=2;
        boolean hasVisiblePixel=false;
        for(int row=height-1; row>=0; row-=2){
            for(int column=0;column<width;column++){
                int offsetY = row/2+height/2-deltaY;
                int offsetX = column-deltaX;
                pixel=image.getRGB(column, row);
                byte alpha=(byte)((pixel)>>24);
                if(alpha!=0){
                    hasVisiblePixel=true;
                    if(offsetX>=0 && offsetY>=0){
                        byte newAlpha=(byte)((image.getRGB(offsetX, offsetY))>>24);
                        if(newAlpha==0){
                            image.setRGB(offsetX, offsetY, 0xAA000000);
                        }
                    }
                }
            }
            if(hasVisiblePixel){
                deltaX++;
            }else{
                deltaY++;
            }
        }
    }
}
