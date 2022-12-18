import JSX from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, Stack } from "@mui/material";

interface EditNoteProps {
    intialValue?: ReactQuill.Value;
}

interface EditNoteState {
    noteValue: ReactQuill.Value;
}

export class EditNote extends JSX.Component<EditNoteProps, EditNoteState> {
    constructor(props: EditNoteProps){
        super(props);
        this.state = { noteValue: this.props.intialValue ?? "Enter text..." };
    }

    render() {
        return (
            <Stack margin={5} spacing={1}>
                <ReactQuill 
                    theme="snow" 
                    value={this.state.noteValue} 
                    onChange={(value) => this.setState({noteValue: value})}
                />
                <Stack direction="row">
                    <Button 
                        variant="contained" sx={{marginX: 1}} 
                        onClick={() => this.setState({noteValue: localStorage.getItem('savedNote') ?? "No notes saved..." })}
                    >
                        Load
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={() => localStorage.setItem('savedNote', this.state.noteValue.toString())}
                    >
                        Save
                    </Button>
                </Stack>
            </Stack>
        );
    }
}