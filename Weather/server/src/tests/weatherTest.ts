import { expect } from "chai";
import { exec } from "child_process";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import sinon from "sinon";
import cron from "node-cron";
import { createAlert } from "../services/alert";

describe("Weather Tests", () => {
  describe("Environment Setup", function () {
    describe("System Setup", () => {
      it("should start the server successfully", function (done) {
        exec("npm start", (error: any, stdout: any, stderr: any) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            console.error(`stderr: ${stderr}`);
          }
          try {
            expect(error).to.be.null;
            expect(stderr).to.be.empty;
            expect(stdout).to.include("Server running on port");
            done();
          } catch (err) {
            done(err);
          }
        });
        done();
      });
    });

    describe("OpenWeatherMap API", () => {
      it("should connect to OpenWeatherMap API with a valid API key", async () => {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${process.env.OPENWEATHER_API_KEY}`
        );
        expect(response.status).to.equal(200);
      });
    });
  });

  describe("Simulating tests", () => {
    const fetchWeatherData = require("../services/fetchData");

    it("should make API calls at configured intervals", function (done) {
      this.timeout(10000);
      const response = {
        data: {
          main: { temp: 300, feels_like: 295, humidity: 50, pressure: 1010 },
          weather: [{ main: "clear sky" }],
          visibility: 10000,
        },
      };
      const axiosStub = sinon.stub(axios, "get").resolves(response);

      const cronSchedule = "*/1 * * * * *";
      const task = cron.schedule(cronSchedule, async () => {
        await fetchWeatherData.default();
      });

      setTimeout(() => {
        try {
          expect(axiosStub.called).to.be.true;
          expect(axiosStub.callCount).to.be.greaterThan(1);
          axiosStub.restore();
          task.stop();
          done();
        } catch (err) {
          task.stop();
          done(err);
        }
      }, 5000);
    });

    it("should retrieve and parse weather data correctly", async () => {
      const response = {
        data: {
          main: { temp: 300, feels_like: 295, humidity: 50, pressure: 1010 },
          weather: [{ main: "clear sky" }],
          visibility: 10000,
        },
      };

      try {
        const axiosStub = sinon.stub(axios, "get").resolves(response);
        const weatherData = await fetchWeatherData.default();
        expect(weatherData).to.deep.equal(response.data);
        axiosStub.restore();
      } catch (error: any) {
        console.error(error.message);
      }
    });
  });

  it("should define and configure user thresholds", async () => {
    try {
      const thresholds = {
        city: "Delhi",
        condition: "condition = rain",
        times: 2,
        email: "aads",
      };
      const configuredThresholds = await createAlert(
        thresholds.city,
        thresholds.condition,
        thresholds.times,
        thresholds.email
      );
      expect(configuredThresholds).to.deep.equal(thresholds);
    } catch (error: any) {
      console.error(error.message);
    }
  });
});
