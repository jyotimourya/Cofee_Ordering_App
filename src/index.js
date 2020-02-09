import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import "./styles.css";

var defaultState = {
  orders: [],
  menu: {
    coffees: ["Cold Cofee", "Flat White", "Long Black", "Cappuccino"],
    sizes: ["Small", "Regular", "Large"],
    sugar: [0, 1, 2, 3]
  }
};

// the reducer
const order = (state = defaultState, action) => {
  switch (action.type) {
    case "ADD_ORDER":
      return {
        ...state,
        orders: [...state.orders, action.newOrder]
      };
    case "REMOVE_ORDER":
      return {
        ...state,
        orders: state.orders.filter(order => {
          return order.id !== action.id;
        })
      };
    default:
      return state;
  }
};

// the store
const store = createStore(order);
const { Component } = React;

class CurrentOrder extends Component {
  render() {
    let orders = this.props.data.map((order, key) => {
      return (
        <tr key={key}>
          <td>{order.id}</td>
          <td>{order.name}</td>
          <td>{order.coffee}</td>
          <td>{order.size}</td>
          <td>{order.sugar}</td>
          <td>
            <button
              type="button"
              className="btn btn-danger btn-xs"
              onClick={this.deleteOrder.bind(this, order.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
    return (
      <div className="order-list">
        <div className="container">
          <h2>Current Orders</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Sugar</th>
              </tr>
            </thead>
            <tbody>{orders}</tbody>
          </table>
          {!orders.length && (
            <div className="alert alert-info" role="alert">
              No orders yet... 
            </div>
          )}
        </div>
      </div>
    );
  }
  deleteOrder(id) {
    store.dispatch({
      type: "REMOVE_ORDER",
      id
    });
  }
}

class OrderForm extends Component {
  render() {
    let coffees = this.props.data.menu.coffees;
    let sizes = this.props.data.menu.sizes;
    let sugar = this.props.data.menu.sugar;

    let coffeeTypes = coffees.map((coffee, key) => {
      return (
        <option key={key} value={coffee}>
          {coffee}
        </option>
      );
    });

    let coffeeSizes = sizes.map((size, key) => {
      return (
        <option key={key} value={size}>
          {size}
        </option>
      );
    });

    let sugarSpoons = sugar.map((spoon, key) => {
      return (
        <option key={key} value={spoon}>
          {spoon}
        </option>
      );
    });

    return (
      <div className="order-form">
        <div className="container">
          <form
            className="form-horizontal"
            onSubmit={this.processOrder.bind(this)}
          >
            <h2>Get a coffee here!</h2>
            <hr />

            <div className="form-group">
              <label className="col-sm-2 control-label">Your name</label>
              <div className="col-sm-10">
                <input
                  required
                  className="form-control"
                  ref="name"
                  type="text"
                  placeholder="Jyoti Mourya"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Coffee Type</label>
              <div className="col-sm-10">
                <select
                  required
                  className="form-control"
                  ref="coffee"
                  name="coffee"
                >
                  <option defaultValue="">Please Select</option>
                  {coffeeTypes}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">What Size?</label>
              <div className="col-sm-10">
                <select
                  required
                  className="form-control"
                  ref="size"
                  name="size"
                >
                  <option defaultValue="">Please Select</option>
                  {coffeeSizes}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Any Sugar?</label>
              <div className="col-sm-10">
                <select
                  required
                  className="form-control"
                  ref="sugar"
                  name="sugar"
                >
                  <option defaultValue="">Please Select</option>
                  {sugarSpoons}
                </select>
              </div>
            </div>
            <input
              className="btn btn-success"
              type="submit"
              value="Place my Order!"
            />
          </form>
        </div>
      </div>
    );
  }
  processOrder(e) {
    e.preventDefault();
    let newOrder = {
      id: this.props.data.orders.length + 1,
      name: this.refs.name.value,
      coffee: this.refs.coffee.value,
      size: this.refs.size.value,
      sugar: this.refs.sugar.value
    };
    store.dispatch({
      type: "ADD_ORDER",
      newOrder
    });
    // resetting the input fields
    (this.refs.name.value = ""),
      (this.refs.coffee.value = "Please Select"),
      (this.refs.size.value = "Please Select"),
      (this.refs.sugar.value = "Please Select");
  }
}

class CoffeeRun extends Component {
  render() {
    return (
      <div>
        <CurrentOrder data={this.props.data.orders} />
        <OrderForm data={this.props.data} />
      </div>
    );
  }
}

// the render method
const render = () => {
  ReactDOM.render(
    <CoffeeRun data={store.getState()} />,
    document.getElementById("root")
  );
};

// subscribing to updates + initial render
store.subscribe(render);
render();
