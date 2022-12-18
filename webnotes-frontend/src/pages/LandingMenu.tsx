import JSX from "react";
import 'react-quill/dist/quill.snow.css';
import { Button, Stack } from "@mui/material";
import { Navigate } from "react-router-dom";

interface LandingMenuProps {
}

interface LandingMenuState {
    navigateToEditNote: boolean;
}

export class LandingMenu extends JSX.Component<LandingMenuProps, LandingMenuState> {
    constructor(props: LandingMenuProps) {
        super(props);
        this.state = {navigateToEditNote: false}
    }

    render() {
        return (
            <Stack marginX={35}>
                <Button>
                    Login
                </Button>
                <Button onClick={() => this.setState({navigateToEditNote: true})}>
                    Use Locally
                </Button>
                {this.state.navigateToEditNote && <Navigate to="/editNote"/>}
            </Stack>
        );
    }
}