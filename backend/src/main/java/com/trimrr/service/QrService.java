package com.trimrr.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Map;

/** Generates QR code PNGs. */
@Service
public class QrService {

    private static final int SIZE = 300;

    public byte[] generatePng(String content) throws Exception {
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(
                content,
                BarcodeFormat.QR_CODE,
                SIZE,
                SIZE,
                Map.of(
                        EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M,
                        EncodeHintType.MARGIN, 1));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", out);
        return out.toByteArray();
    }
}
