import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Rank from "./components/Rank/Rank";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Particles from "react-tsparticles";

const particleOptions = {
  fpsLimit: 60,

  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: true,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.3,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 3,
    },
  },
  detectRetina: true,
};

const initialState = {
  input: "",
  imageURL: "",
  boxes: [],
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (response) => {
    const image = document.querySelector("#input-image");
    const width = Number(image.width);
    const height = Number(image.height);
    const boxes = [];
    // const regions = JSON.parse(response, null, 2).outputs[0].data.regions;
    const regions = response.outputs[0].data.regions;

    regions.forEach((region) => {
      boxes.push({
        leftCol: region.region_info.bounding_box.left_col * width,
        topRow: region.region_info.bounding_box.top_row * height,
        rightCol: width - region.region_info.bounding_box.right_col * width,
        bottomRow: height - region.region_info.bounding_box.bottom_row * height,
      });
    });

    return boxes;
  };

  displayFaceBox = (boxes) => {
    this.setState({ boxes });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input });

    fetch("http://localhost:8000/image", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageURL: this.state.input }),
    })
      .then((response) => {
        if (response.status === 400) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        fetch("http://localhost:8000/image", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: this.state.user.id }),
        })
          .then((res) => res.json())
          .then((entries) => {
            this.setState(Object.assign(this.state.user, { entries }));
          })
          .catch(console.log);

        this.displayFaceBox(this.calculateFaceLocation(data));
      })
      .catch(console.log);
  };

  /* particlesInit = (main) => {
    // console.log(main);
    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  };

  particlesLoaded = (container) => {
    // console.log(container);
  }; */

  onRouteChange = (route) => {
    if (route === "home") {
      this.setState({ isSignedIn: true });
    }

    if (route === "signin") {
      this.setState(initialState);
    }

    this.setState({ route });
  };

  render() {
    return (
      <div className="App">
        <Particles
          id="tsparticles"
          // init={this.particlesInit}
          // loaded={this.particlesLoaded}
          options={particleOptions}
          className="particles"
        />

        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={this.state.isSignedIn}
        />

        {this.state.route === "signin" ? (
          <Signin
            onRouteChange={this.onRouteChange}
            onLoadUser={this.loadUser}
          />
        ) : this.state.route === "register" ? (
          <Register
            onRouteChange={this.onRouteChange}
            onLoadUser={this.loadUser}
          />
        ) : (
          <>
            <Logo />
            <Rank
              userName={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              boxes={this.state.boxes}
              url={this.state.imageURL}
            />
          </>
        )}
      </div>
    );
  }
}

export default App;
