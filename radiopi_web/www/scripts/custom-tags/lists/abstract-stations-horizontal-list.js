import { LitElement, html, css } from "https://jspm.dev/lit-element@2";
import { fetchCountryFromCurrentLocation } from "../../radio-browser-api.js";

export class AbstractStationsHorizontalList extends LitElement {
  static get properties() {
    return {
      country: { type: String },
      stations: { type: Array },
      playingStationId: {},
      title: { type: String },
      fetchStations: { type: Function },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-weight: 400;
      }

      h2 {
        margin: 10px 0;
        padding: 0 16px;
        font-size: 30px;
        font-weight: var(--font-size);
        font-family: var(--font-family);
      }

      station-card {
        width: 16.6667%;
      }

      station-card:first-child {
        padding-left: 16px;
      }

      station-card:last-child {
        padding-right: 16px;
      }
    `;
  }

  constructor() {
    super();
    this.stations = [];
    this.audio = null;
    this.renderStation = this.renderStation.bind(this);
    this.addEventListener("play-station", function (ev) {
      console.log(ev);
      const currentStation = this.stations.find(
        (station) => station.changeuuid == ev.detail.id
      );
      currentStation && (this.playingStationId = currentStation.changeuuid);
      this.audio && this.audio.pause();
      this.audio = new Audio(currentStation.url);
      this.audio.play();
    });
    this.addEventListener("stop-station", function (ev) {
      console.log(ev);
      this.playingStationId = null;
      this.audio.pause();
      this.audio = null;
    });
  }

  connectedCallback() {
    super.connectedCallback();
    fetchCountryFromCurrentLocation().then(({ country }) => {
      this.country = country;
    });
  }

  render() {
    return html`
      <h2 part="title">${this.title}</h2>
      <horizontal-list>
        ${this.stations.map(this.renderStation)}
      </horizontal-list>
    `;
  }

  renderStation(station) {
    return html`
      <station-card
        img="${station.favicon}"
        title="${station.name}"
        id="${station.changeuuid}"
        ?playing="${station.changeuuid === this.playingStationId}"
      ></station-card>
    `;
  }

  updated(changedProperties) {
    changedProperties.forEach((_, propName) => {
      if (propName == "country") {
        this.fetchStations(this.country, 20).then((data) => {
          this.stations = data;
        });
      }
    });
  }
}
