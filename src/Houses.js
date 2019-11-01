import React, { Component } from 'react'
import { List,Icon } from 'antd'

class Houses extends Component{
    constructor( props){
        super(props);
    }

    render() {
        return (
            <div style={{height:300,  overflowY:"scroll",  scrollBehavior: "smooth"}}>
                <List
                    header={<div> <Icon type="home" theme="outlined" style={{fontSize:36}} />   Это домики</div>}
                    footer={<div>Footer</div>}
                    bordered
                    dataSource={this.props.houses}
                    renderItem={item => (
                        <List.Item>
                          <p>{item.geo_lat}-{item.geo_lon}</p>
                           {item.house_addr}
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}

export default Houses;
