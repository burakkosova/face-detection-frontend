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

    const raw = JSON.stringify({
      user_app_id: {
        user_id: "q3i17d8o2quk",
        app_id: "f66197064d314968a666379c7537b797",
      },
      inputs: [
        {
          data: {
            image: {
              url: this.state.input,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key 3245d277e2a747fb89bd36a11b51d38b",
      },
      body: raw,
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch(
      "https://api.clarifai.com/v2/models/face-detection/outputs",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status.code === 10000) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((result) => {
              this.setState(
                Object.assign(this.state.user, { entries: result })
              );
            })
            .catch(console.log);
          this.displayFaceBox(this.calculateFaceLocation(result));
        }
      })
      .catch((error) => console.log("error", error));
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
