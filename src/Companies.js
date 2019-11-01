import React, { Component } from 'react'
import { Select } from 'antd'

const { Option } = Select;

class Companies extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div>
        <label style={{ paddingRight: 10 }}>Выберите компанию </label>
        <Select autoFocus={true}
          defaultActiveFirstOption={true}
          defaultValue={this.props.comps[0].id}
          onChange={this.props.onCompanyChange}
          style={{ width: 600 }}>
          {this.props.comps.map((v, i) => {
            return (
              <Option
                value={v.id}
                key={i.toString() + "-" + i.toString()} >
                {v.comp_name}
              </Option>)
          })}
        </Select>
      </div>
    )
  }

}

export default Companies