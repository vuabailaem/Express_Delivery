import React, { Component } from 'react';


class Product extends Component {

  addToCart = () => {
    alert(this.props.name + '-' + this.props.price);
  }

    render() {
      return (
        <div className="col-4">
            <div className="card">
                <img className="card-img-top" src={ this.props.src } alt={ this.props.id +'.'+ this.props.name } />
                <div className="card-body">
                    <h4 className="card-title">{ this.props.name }</h4>
                    <p className="card-text"> { this.props.price } </p>
                    <p><a className="btn btn-primary" href="/#" onClick={ this.addToCart }>Buy Now</a></p>
                </div>
            </div>
        </div>
      );
    }
  };

export default Product;
