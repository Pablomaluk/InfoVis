import { createChart1, updateChart1 } from "./first_vis.mjs";
import { createChart3 } from "./third_vis.mjs";

const svg1 = createChart1();
createChart3(document.getElementById("league-filter").value, document.getElementById("result-filter").value);

d3.select("#league-filter").on("change", (event) => {
    updateChart1(
        svg1,
        event.target.value, 
        document.getElementById("score-team-filter-vis-1").value,
        document.getElementById("score-time-filter-vis-1").value);
    createChart3(event.target.value, document.getElementById("result-filter").value);
});