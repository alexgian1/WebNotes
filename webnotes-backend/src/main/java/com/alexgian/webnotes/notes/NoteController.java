package com.alexgian.webnotes.notes;

import jakarta.annotation.Nullable;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoteController {

    private final NoteRepository noteRepository;

    @Autowired
    public NoteController(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @GetMapping("/echo")
    public String echo(@Nullable @RequestParam("string") String value) {
        return value == null ? "Empty: Set <i>string</i> to echo message" : value;
    }

    @GetMapping("/findNoteById")
    public Note findNoteById(@NonNull @RequestParam("id") int id) {
        return noteRepository.findById(id);
    }

}
