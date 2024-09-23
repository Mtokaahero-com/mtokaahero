

type LoginResponse = {
    token: string;
    userEmail: string;
    userName: string;
    userRole: string;
    id: string;
}


const initialState :Partial <LoginResponse> ={}