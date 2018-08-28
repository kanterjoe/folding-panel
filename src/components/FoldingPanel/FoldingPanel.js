import React, { Component } from 'react';
import "./animate.css"
const TRANSITION_TIME = 500,
    SKEW = 10,


 sigmoidFactory  =steepness  => {
    const sig = x =>  (1 / (1 + Math.exp(-steepness * x))) - 0.5;

    return step =>  0.5 / sig(1) * sig(2 * Math.min(Math.max(step , 0), 1) - 1) + 0.5;

};

class FoldingPanel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sidebarHeight: 26,
            open: false,
            openPercentage:0,
            isAnimating: false,
            opening: true,
        };
        this.children=[];
        this.animationTimers = [];
    }
    updateSidebarHeight = (sidebarHeight) => {
        if (sidebarHeight > this.state.sidebarHeight) {
            this.setState({sidebarHeight})
        }
    };
    endAnimation = () => {
        console.log("Ending Animation",this.state.open)
        this.setState({ isAnimating:false });

        this.updateSidebarHeight( document.getElementById("sidebar").clientHeight );

        console.log("Done: ", this.state.sidebarHeight)
        this.animationTimers.forEach(timer => clearInterval(timer))
        this.animationTimers = []

    };

    nextAnimationFrame = () => {
        if (this.state.isAnimating && this.state.openPercentage <= 100 && this.state.openPercentage >= 0 ) {
            const newOpenPerc = this.state.openPercentage + (this.state.opening? 1 : -1) ;

            this.setState({openPercentage: newOpenPerc});
        }
        else if (this.state.isAnimating && this.state.opening && this.state.openPercentage > 100) {
            this.setState({openPercentage: 100});

            this.endAnimation();
        }
        else if (this.state.isAnimating && !this.state.opening && this.state.openPercentage < 0) {
            this.setState({openPercentage: 0});

            this.endAnimation();
        }
        else console.error("Not Animating, but attempting animation frame")
    };
    closePanel = () => {
        if (!this.state.isAnimating) {
            this.setState({open:false, isAnimating:true, opening: false});
            this.animationTimers.push ( setInterval(this.nextAnimationFrame, (this.props.transitionTime || TRANSITION_TIME )/ 100) )
        }
    };
    openPanel = () =>  {
        if (!this.state.isAnimating) {
            this.setState({open:true, isAnimating:true, opening: true});
            this.animationTimers.push ( setInterval(this.nextAnimationFrame, (this.props.transitionTime || TRANSITION_TIME )/ 100) )

        }
    };
    toggle = () => {
        console.log("toggling",this.state.open, this)
        if (this.state.open) {
            console.log("Closing");
            this.closePanel();
        }
        else {
            console.log("Opening");
            this.openPanel();

        }

    };
    componentDidMount() {
        this.children = (Array.isArray(this.props.children)? [...this.props.children]: [this.props.children]);
        this.updateSidebarHeight(  this.sidebar.clientHeight );

        console.log("Mounted: ", this.state.sidebarHeight);
        this.closePanel()
    };
    render = () => {

        const sidebar = this.children.filter( ({type: tagName}) => tagName==='section' );
        const mainContent = this.children.filter( ({type: tagName}) => tagName==='main' );


        const   modifier    = sigmoidFactory(this.props.animationSigmoid || 4.5),
                rotation    = 90 * modifier(this.state.openPercentage/100),
                translation = this.state.sidebarHeight * Math.cos((Math.PI/180) * rotation)

        console.log(`Translation: ${translation}, rotation: ${rotation}`)



        return (
            <div className="wrapper">
                <div className={"sidebar " + (this.state.open? "open":"closed")}
                     onClick={this.closePanel}
                     id={"sidebar"}
                     ref={ (divElement) => this.sidebar = divElement}
                     style = {{transform: `rotateX(${rotation}deg) skewX(${(this.props.skew || SKEW )  * modifier(this.state.openPercentage/100)}deg)`}}
                     // style = {{transform: `rotateX(${rotation}deg)`}}
                >
                    {sidebar}
                </div>
                <div className={"base " + (this.state.open? "open":"closed")} style={{transform: `translateY(${translation}px)`}}>
                    {mainContent}
                </div>
                <button onClick={this.toggle} style={{'margin-top': '600px', 'z-index':3}}>CLICK TO TOGGLE</button>
            </div>
        )
    }
}


export default FoldingPanel;