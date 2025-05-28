package com.bigwin.bigwin.server.util;


import java.util.UUID;

public class ReferralCodeGenerator {
    public static String generate() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
