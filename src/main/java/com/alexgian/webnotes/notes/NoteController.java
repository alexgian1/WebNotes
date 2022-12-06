package com.alexgian.webnotes.notes;

import jakarta.annotation.Nullable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoteController {
    @GetMapping("/echo")
    public String echo(@Nullable @RequestParam("string") String value) {
        return value == null ? "Empty: Set <i>string</i> to echo message" : value;
    }
}
