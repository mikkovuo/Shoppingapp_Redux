import{
    GET_SHOPPINGLIST_SUCCESS,
    GET_SHOPPINGLIST_FAILED,
    ADD_TO_LIST_SUCCESS,
    ADD_TO_LIST_FAILED,
    REMOVE_FROM_LIST_SUCCESS,
    REMOVE_FROM_LIST_FAILED,
    EDIT_ITEM_SUCCESS,
    EDIT_ITEM_FAILED,
    REMOVE_STATE
} from '../actions/shoppingActions';

const getInitialState = () => {
    if(sessionStorage.getItem("shoppingstate")){
        return JSON.parse(sessionStorage.getItem("shoppingstate"))
    } else {
        return {
            list: [],
            error: ""
        }
    }
}

const saveToStorage = (state) => {
    sessionStorage.setItem('shoppingstate',JSON.stringify(state));
}

const initialState = getInitialState();

const shoppingReducer = (state=initialState,action) => {
    console.log('shoppingReducer, action type: '+action.type);
    let tempState = {};
    switch(action.type) {
        case GET_SHOPPINGLIST_SUCCESS:
            tempState = {
                list:action.list,
                error:''
            }
            saveToStorage(tempState);
        return tempState
        case GET_SHOPPINGLIST_FAILED:
            tempState = {
                ...state,
                error:action.error
            }
            saveToStorage(tempState);
        return tempState
        case ADD_TO_LIST_SUCCESS:
            tempState = {
                ...state,
                error:''
            }
            saveToStorage(tempState);
        return tempState
        case ADD_TO_LIST_FAILED:
            tempState = {
                ...state,
                error:action.error
            }
            saveToStorage(tempState);
        return tempState
        case REMOVE_FROM_LIST_SUCCESS:
            tempState = {
                ...state,
                error:''
            }
            saveToStorage(tempState);
        return tempState
        case REMOVE_FROM_LIST_FAILED:
            tempState = {
                ...state,
                error:action.error
            }
            saveToStorage(tempState);
        return tempState
        case EDIT_ITEM_SUCCESS:
            tempState = {
                ...state,
                error:''
            }
            saveToStorage(tempState);
        return tempState
        case EDIT_ITEM_FAILED:
            tempState = {
                ...state,
                error:action.error
            }
            saveToStorage(tempState);
        return tempState
        
        case REMOVE_STATE:
            tempState = {
                list:[],
                error:''
            }
            saveToStorage(tempState);
        return tempState
        default:
            return state;
    }
}

export default shoppingReducer;