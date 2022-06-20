import React from 'react';
import { Card, Label, Input, Button } from 'theme-ui'

export function ChangePass() {

    return (
        <>
            <Card sx={{ display: 'flex', mt: '20px', mx: "33%", alignItems: 'center', justifyContent: 'center', }}>
                <div>    
                    <div>
                        <Label>Old Password</Label>
                        <Input

                        ></Input>
                    </div>
                    <div>
                        <Label>New Password</Label>
                        <Input

                        ></Input>
                    </div>
                    <Button
                        sx={{ mt: "10px" }}
                    >Change Password</Button>
                </div>

            </Card>
        </>
    )
}