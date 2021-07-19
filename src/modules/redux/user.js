import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { deleteCookie, setCookie } from '../../shared/Cookie';
import { apis } from '../../shared/api';


// action
const LOGIN = 'user/LOGIN';
const LOGOUT = 'user/LOGOUT';


// action creator
const setLogin = createAction(LOGIN, (user) => ({ user }));
const logOut = createAction(LOGOUT, (user) => ({ user }));

// initialState
const initialState = {
    user: null,
    is_login: false,
}

// Thunk function

const setLoginDB = (id,pw) => {
    return function (dispatch, getState, { history }) {
        apis
        .login(id,pw)
        .then((res) => {
            console.log(res.data[0].username);
			console.log(res.data[1].token);
            setCookie('token', res.data[1].token, 7);
			setCookie('username',res.data[0].username, 7);
			dispatch(setLogin({id: id,}));
            history.replace('/');
        })
        .catch((err) => {
            console.log(err)
        });
    };
};

const registerDB = (email, nick, id, pw) => {
    return function (dispatch, getState, { history }) {
        apis
        .signup(email, nick, id, pw)
        .then((res) => {
            console.log(res)
            history.push('/login');
        })
        .catch((err) => {
            console.log(err);
        });
    };
};

const logOutDB = () => {
    return function (dispatch, getState, { history }) {
            deleteCookie('token');
            deleteCookie('username');
            dispatch(logOut());
            history.push('/');
    };
};


// reducer
export default handleActions({
    [LOGIN] : (state, action) => produce(state, (draft) => {
        draft.user = action.payload.user;
        draft.is_login = true;
    }),
    [LOGOUT] : (state, action) => produce(state, (draft) => {
        draft.user = null;
        draft.is_login = false;
    }),
}, initialState)

const userCreators = {
    setLoginDB,
    registerDB,
    logOutDB,
}

export { userCreators };

