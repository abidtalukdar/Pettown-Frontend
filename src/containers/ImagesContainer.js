import React, { Component } from 'react';
import ImageCard from "../components/ImageCard"

class ImagesContainer extends Component {
    
    renderImages = () => {
        return this.props.images.map(image => {
            return <ImageCard key={image.id} image={image} currentUser={this.props.currentUser} handleDeleteImage={this.props.handleDeleteImage} />
        })
    }
    
    render() {
        return (
            <div>
                {this.renderImages()}
            </div>
        );
    }
}

export default ImagesContainer;