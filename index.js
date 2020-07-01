import { select, selectAll } from "d3-selection";
import { max, extent } from "d3-array";
import { scaleLinear, scaleTime } from "d3-scale";

select(".graph").append("h1").html("Olá mundo");

let tweets = require("./data/tweet.json");

console.log(tweets.tweets);

function dataViz(incomingData, tagRaiz) {
  incomingData.forEach((element) => {
    element.impact = element.retweets.length + element.favorites.length;
    element.tweetTime = new Date(element.timestamp);
  });

  let maxImpact = max(incomingData, (el) => {
    return el.impact;
  });

  let startEnd = extent(incomingData, (el) => {
    return el.tweetTime;
  });

  let timeRamp = scaleTime().domain(startEnd).range([50, 460]);
  let yScale = scaleLinear().domain([0, maxImpact]).range([0, 460]);
  let radiusScale = scaleLinear().domain([0, maxImpact]).range([1, 20]);

  let teamG = select(tagRaiz)
    .selectAll("g")
    .data(incomingData, (d) => {
      return JSON.stringify(d);
    })
    .enter()
    .append("g")
    .attr("transform", (d) => {
      return (
        "translate(" +
        timeRamp(d.tweetTime) +
        "," +
        (500 - yScale(d.impact)) +
        ")"
      );
    });

  teamG
    .append("circle")
    .attr("r", (d) => {
      return radiusScale(d.impact);
    })
    .style("fill", "#990000")
    .style("stroke", "black")
    .style("stroke-width", "1px");

  teamG.append("text").text((d) => {
    return d.user;
  });

  filterDatas(incomingData, tagRaiz);
}

function filterDatas(incomingData, tagRaiz) {
  let filteredDatas = incomingData.filter((el) => {
    return el.impact > 0;
  });

  console.log(filteredDatas);
  
  selectAll("g")
    .data(filteredDatas, (d) => {
      return JSON.stringify(d);
    })
    .exit()
    .remove();
}

dataViz(tweets.tweets, "svg");
