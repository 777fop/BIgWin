package com.bigwin.bigwin.server.util.exceptions;


public class EmailAlreadyUsedException extends RuntimeException {
    public EmailAlreadyUsedException(String message) {
        super(message);
    }
}
