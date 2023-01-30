package com.alexgian.webnotes.notes;

import com.google.gson.Gson;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NoteController.class)
public class NoteControllerTest {
    @Autowired
    MockMvc mvc;

    @MockBean
    NoteRepository noteRepository;

    @Test
    public void echoWithStringReturnsString() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/echo").param("string","test").accept(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("test"));
    }

    @Test
    public void echoEmptyReturnsDescription() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/echo").accept(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("Empty: Set <i>string</i> to echo message"));
    }

    @Test
    public void findNoteByIdReturnsNoteWhenNoteExists() throws Exception {
        Note note = new Note(0,"test","test");
        given(noteRepository.findById(0)).willReturn(note);
        mvc.perform(MockMvcRequestBuilders.get("/findNoteById").param("id","0").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(new Gson().toJson(note)));
    }

    @Test
    public void findNoteByIdReturnsNothingWhenNoteDoesNotExist() throws Exception {
        given(noteRepository.findById(0)).willReturn(null);
        mvc.perform(MockMvcRequestBuilders.get("/findNoteById").param("id","0").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(""));
    }
}
