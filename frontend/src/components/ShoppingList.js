import React from 'react';
import {Table, Button} from 'semantic-ui-react';
import Row from './Row';
import RemoveRow from './RemoveRow';
import EditRow from './EditRow';
import {connect} from 'react-redux';
import {getList,removeFromList,editItem} from '../actions/shoppingActions';

class ShoppingList extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            removeIndex: -1,
            editIndex: -1,
            search:""
        }
    }

    onChange = (event) => {
        let state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    searchByType = (event) => {
        this.props.dispatch(getList(this.props.token,this.state.search));
        this.setState({
            search:""
        })
    }

    changeToRemoveMode = (id) => {
        for(let ii=0; ii < this.props.shoppinglist.length;ii++){
            if(id === this.props.shoppinglist[ii]._id){
                this.setState({
                    removeIndex: ii,
                    editIndex: -1
                })
            }
        }
    }

    changeToEditMode = (id) => {
        for(let ii=0; ii < this.props.shoppinglist.length;ii++){
            if(id === this.props.shoppinglist[ii]._id){
                this.setState({
                    removeIndex: -1,
                    editIndex: ii
                })
            }
        }
    }

    removeFromList = (id) => {
        this.props.dispatch(removeFromList(this.props.token,id));
        this.cancel();
    }

    editItem = (item) => {
        this.props.dispatch(editItem(this.props.token,item));
        this.cancel();
    }

    cancel = () => {
        this.setState({
            removeIndex:-1,
            editIndex:-1
        })
    }

    // key is mandatory and must be unique!!!!
    render(){
        let items = this.props.shoppinglist.map((item,index) =>{
            if(this.state.removeIndex===index) {
                return <RemoveRow key= {item._id} item={item} 
                removeFromList={this.removeFromList} 
                cancel={this.cancel} />
            }
            if(this.state.editIndex===index){
                return <EditRow key= {item._id} item={item} 
                editItem={this.editItem} 
                cancel={this.cancel} />
            }

            return <Row key= {item._id} item={item} 
            changeToEditMode={this.changeToEditMode} 
            changeToRemoveMode={this.changeToRemoveMode} />
            }
        )
        return(
            <div>
                <label htmlFor="search">Search by type:</label>
                <input type="text" name = "search" onChange = {this.onChange}
                    value = {this.state.search} />
                <Button style={{marginLeft:10}} onClick={this.searchByType}>Search</Button>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Count</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell>Remove</Table.HeaderCell>
                            <Table.HeaderCell>Edit</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {items}
                    </Table.Body>
                </Table>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.login.token,
        shoppinglist: state.shopping.list
    }
}

export default connect(mapStateToProps)(ShoppingList);