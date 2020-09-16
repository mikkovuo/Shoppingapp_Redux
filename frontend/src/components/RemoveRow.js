import React from 'react';
import {Table, Button} from 'semantic-ui-react';

export default class RemoveRow extends React.Component{

    cancel = () => {
        this.props.cancel();
    }

    removeFromList = (event) => {
        this.props.removeFromList(event.target.name);
    }

    render(){
        return(
            <Table.Row>
                <Table.Cell>{this.props.item.type}</Table.Cell>
                <Table.Cell>{this.props.item.count}</Table.Cell>
                <Table.Cell>{this.props.item.price}</Table.Cell>
                <Table.Cell><Button color='red' onClick={this.cancel}>Cancel</Button></Table.Cell>
                <Table.Cell><Button color='green' onClick={this.removeFromList} name={this.props.item._id}>Confirm</Button></Table.Cell>
            </Table.Row>
        )
    }

}