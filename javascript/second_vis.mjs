const svg2 = d3.select("#vis_2").append("svg");
const WIDTH = 900;
const HEIGHT = 1400;

svg2.attr("width", WIDTH).attr("height", HEIGHT).style("border", "1px solid black");

d3.select("#matchday-filter").on("change", (event) => {
    createChart2(document.getElementById("league-filter").value, event.target.value);
})

d3.select("#reset-button").on("click", (event) => {
    svg2.selectAll(".team_group").remove();
    createChart2(document.getElementById("league-filter").value, document.getElementById("matchday-filter").value);
})

let radialScale = d3.scaleLinear()
    .domain([0, 4])
    .range([0, 80]);

let legend_group = svg2.append("g").attr("id", "legend_group");

legend_group.append("circle")
    .attr("class", "legend_circle")
    .transition()
    .duration(500)
    .attr("cx", 295)
    .attr("cy", 25)
    .attr("r", 5)
    .attr("fill", "#79B4A9")

legend_group.append("text")
    .attr("class", "legend_text")
    .transition()
    .duration(500)
    .attr("x", 305)
    .attr("y", 30)
    .attr("text-anchor", "start")
    .attr("font-size", 15)
    .attr("font-weight", "bold")
    .attr("fill", "#79B4A9")
    .text("Rendimiento esperado")

legend_group.append("circle")
    .attr("class", "legend_circle_2")
    .transition()
    .duration(500)
    .attr("cx", 485)
    .attr("cy", 25)
    .attr("r", 5)
    .attr("fill", "#7765E3")

legend_group.append("text")
    .attr("class", "legend_text_2")
    .transition()
    .duration(500)
    .attr("x", 495)
    .attr("y", 30)
    .attr("text-anchor", "start")
    .attr("font-size", 15)
    .attr("font-weight", "bold")
    .attr("fill", "#7765E3")
    .text("Rendimiento real")

function createChart2(league, matchday){
    d3.csv("data/last5.csv").then((data) => {
        console.log(data.filter(d => d.league_name == league && d.matchday == matchday));

        let max_goals_for = d3.max(data.filter(d => d.league_name == league && d.matchday == matchday), d => Math.max(d.last5_fulltime_goals_for_mean, d.fulltime_goals_for));
        let dataRadialScale1 = d3.scaleLinear()
            .domain([0, max_goals_for])
            .range([0, 80]);

        let max_goals_against = d3.max(data.filter(d => d.league_name == league && d.matchday == matchday), d => Math.max(d.last5_fulltime_goals_against_mean, d.fulltime_goals_against));
        let dataRadialScale2 = d3.scaleLinear()
            .domain([0, max_goals_against])
            .range([0, 80]);

        function getPathCoordinates(points, mode) {
            if (mode == 1){
            let x1 = Math.cos((150) * (Math.PI / 180)) * dataRadialScale1(points.last5_fulltime_goals_for_mean);
            let y1 = Math.sin((150) * (Math.PI / 180)) * dataRadialScale1(points.last5_fulltime_goals_for_mean);
            let x2 = Math.cos((90) * (Math.PI / 180)) * dataRadialScale1(points['last5_1sthalf_goals_for_mean']);
            let y2 = Math.sin((90) * (Math.PI / 180)) * dataRadialScale1(points['last5_1sthalf_goals_for_mean']);
            let x3 = Math.cos((30) * (Math.PI / 180)) * dataRadialScale1(points['last5_2ndhalf_goals_for_mean']);
            let y3 = Math.sin((30) * (Math.PI / 180)) * dataRadialScale1(points['last5_2ndhalf_goals_for_mean']);
            let x4 = Math.cos((-30) * (Math.PI / 180)) * dataRadialScale2(points.last5_fulltime_goals_against_mean);
            let y4 = Math.sin((-30) * (Math.PI / 180)) * dataRadialScale2(points.last5_fulltime_goals_against_mean);
            let x5 = Math.cos((-90) * (Math.PI / 180)) * dataRadialScale2(points['last5_1sthalf_goals_against_mean']);
            let y5 = Math.sin((-90) * (Math.PI / 180)) * dataRadialScale2(points['last5_1sthalf_goals_against_mean']);
            let x6 = Math.cos((-150) * (Math.PI / 180)) * dataRadialScale2(points['last5_2ndhalf_goals_against_mean']);
            let y6 = Math.sin((-150) * (Math.PI / 180)) * dataRadialScale2(points['last5_2ndhalf_goals_against_mean']);
            return `M ${WIDTH / 2 + x1} ${HEIGHT / 2 - y1} L ${WIDTH / 2 + x2} ${HEIGHT / 2 - y2} L ${WIDTH / 2 + x3} ${HEIGHT / 2 - y3} L ${WIDTH / 2 + x4} ${HEIGHT / 2 - y4} L ${WIDTH / 2 + x5} ${HEIGHT / 2 - y5} L ${WIDTH / 2 + x6} ${HEIGHT / 2 - y6} L ${WIDTH / 2 + x1} ${HEIGHT / 2 - y1}`;
            } else {
            let x1 = Math.cos((150) * (Math.PI / 180)) * dataRadialScale1(points.fulltime_goals_for);
            let y1 = Math.sin((150) * (Math.PI / 180)) * dataRadialScale1(points.fulltime_goals_for);
            let x2 = Math.cos((90) * (Math.PI / 180)) * dataRadialScale1(points['1sthalf_goals_for']);
            let y2 = Math.sin((90) * (Math.PI / 180)) * dataRadialScale1(points['1sthalf_goals_for']);
            let x3 = Math.cos((30) * (Math.PI / 180)) * dataRadialScale1(points['2ndhalf_goals_for']);
            let y3 = Math.sin((30) * (Math.PI / 180)) * dataRadialScale1(points['2ndhalf_goals_for']);
            let x4 = Math.cos((-30) * (Math.PI / 180)) * dataRadialScale2(points.fulltime_goals_against);
            let y4 = Math.sin((-30) * (Math.PI / 180)) * dataRadialScale2(points.fulltime_goals_against);
            let x5 = Math.cos((-90) * (Math.PI / 180)) * dataRadialScale2(points['1sthalf_goals_against']);
            let y5 = Math.sin((-90) * (Math.PI / 180)) * dataRadialScale2(points['1sthalf_goals_against']);
            let x6 = Math.cos((-150) * (Math.PI / 180)) * dataRadialScale2(points['2ndhalf_goals_against']);
            let y6 = Math.sin((-150) * (Math.PI / 180)) * dataRadialScale2(points['2ndhalf_goals_against']);
            return `M ${WIDTH / 2 + x1} ${HEIGHT / 2 - y1} L ${WIDTH / 2 + x2} ${HEIGHT / 2 - y2} L ${WIDTH / 2 + x3} ${HEIGHT / 2 - y3} L ${WIDTH / 2 + x4} ${HEIGHT / 2 - y4} L ${WIDTH / 2 + x5} ${HEIGHT / 2 - y5} L ${WIDTH / 2 + x6} ${HEIGHT / 2 - y6} L ${WIDTH / 2 + x1} ${HEIGHT / 2 - y1}`;
            }
        }
        
        let teams = data.filter(d => d.league_name == league && d.matchday == matchday).map(d => d.team);
        let dropdown3 = d3.select("#matchday-filter")
        dropdown3.selectAll("option").data(data.filter(d => d.league_name == league && d.team == teams[0])).join(
            enter => {
                enter.append("option")
                    .text(function(d) {
                        return d.matchday;
                    })
                    .attr("value", function(d) {
                        return d.matchday;
                    });
            },
            update => {
                update,
                update.text(function(d) {
                    return d.matchday;
                })
                .attr("value", function(d) {
                    return d.matchday;
                });
            },
            exit => {
                exit.remove()
            });

        svg2.selectAll(".team_group")
            .data(data.filter(d => d.league_name == league && d.matchday == matchday))
            .join(
                enter => {
                    // console.log("enter");
                    let G = enter.append("g")
                        .attr("id", (_, i) => `team_group_${i}`)
                        .attr("class", "team_group")
                        .attr("transform", (_, i) => `translate(${(i % 4) * 200 - 300}, ${(Math.floor(i / 4)) * 270 - 520})`)

                    G.selectAll("grid_circle_group")
                        .data([1, 2, 3, 4])
                        .join(
                            enter => {
                                let group = enter.append("g")
                                    .attr("class", "grid_circle_group")
                    
                                group.append("circle")
                                    .transition()
                                    .duration(500)
                                    .attr("class", "grid_circle")
                                    .attr("cx", WIDTH / 2)
                                    .attr("cy", HEIGHT / 2)
                                    .attr("fill", "transparent")
                                    .attr("stroke", (_, i) => i == 3 ? "black" : "gray")
                                    .attr("r", d => radialScale(d))
                            }
                        );

                    G.selectAll(".grid_line")
                        .data(["last5_fulltime_goals_for_mean", "last5_1sthalf_goals_for_mean", "last5_2ndhalf_goals_for_mean", "last5_fulltime_goals_against_mean", "last5_1sthalf_goals_against_mean", "last5_2ndhalf_goals_against_mean"])
                        .join(
                            enter => {
                                // console.log("enter");
                                let G2 = enter.append("g")
                                    .attr("id", (_, i) => `grid_line_${i}`)
                                    .attr("class", "grid_line")
                                
                                G2.append("line")
                                    .attr("id", (_, i) => `grid_line_${i}`)
                                    .attr("class", "grid_line")
                                    .transition()
                                    .duration(500)
                                    .attr("x1", WIDTH / 2)
                                    .attr("y1", HEIGHT / 2)
                                    .attr("x2", (_, i) => {
                                        let x = Math.cos(((i - 2.5) * -60) * (Math.PI / 180)) * 80;
                                        return WIDTH / 2 + x;
                                    }
                                    )
                                    .attr("y2", (_, i) => {
                                        let y = Math.sin(((i - 2.5) * -60) * (Math.PI / 180)) * 80;
                                        return HEIGHT / 2 - y;
                                    }
                                    )
                                    .attr("stroke", "gray")
                                    .attr("stroke-width", 1)
                                    .style("stroke-dasharray", ("3, 3"))

                                    G2.append("text")
                                        .attr("id", (_, i) => `grid_text_${i}`)
                                        .attr("class", "grid_text")
                                        .transition()
                                        .duration(500)
                                        .attr("x", (_, i) => {
                                            let x = Math.cos(((i - 2.5) * -60) * (Math.PI / 180)) * 90;
                                            return WIDTH / 2 + x;
                                        }
                                        )
                                        .attr("y", (_, i) => {
                                            let y = Math.sin(((i - 2.5) * -60) * (Math.PI / 180)) * 90;
                                            return HEIGHT / 2 - y;
                                        }
                                        )
                                        .attr("text-anchor", "middle")
                                        .attr("dominant-baseline", "middle")
                                        .attr("font-size", "12px")
                                        .attr("fill", "gray")
                                        .attr("transform", (_, i) => {
                                            let x = Math.cos(((i - 2.5) * -60) * (Math.PI / 180)) * 90;
                                            let y = Math.sin(((i - 2.5) * -60) * (Math.PI / 180)) * 90;
                                            return `rotate(${((i % 3) * 60) - 60}, ${WIDTH / 2 + x}, ${HEIGHT / 2 - y})`;
                                        }
                                        )
                                        .text(d => {
                                            switch (d) {
                                                case "last5_fulltime_goals_for_mean":
                                                    return "TC";
                                                case "last5_1sthalf_goals_for_mean":
                                                    return "1T";
                                                case "last5_2ndhalf_goals_for_mean":
                                                    return "2T";
                                                case "last5_fulltime_goals_against_mean":
                                                    return "TC";
                                                case "last5_1sthalf_goals_against_mean":
                                                    return "1T";
                                                case "last5_2ndhalf_goals_against_mean":
                                                    return "2T";
                                            }
                                        })
                            })

                    G.append("text")
                        .attr("class", "grid_text")
                        .transition()
                        .duration(500)
                        .attr("x", WIDTH / 2)
                        .attr("y", HEIGHT / 2 - 105)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "12px")
                        .attr("fill", "gray")
                        .attr("font-weight", "bold")
                        .text("Anotados")
                    
                    G.append("text")
                        .attr("class", "grid_text")
                        .transition()
                        .duration(500)
                        .attr("x", WIDTH / 2)
                        .attr("y", HEIGHT / 2 + 105)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "12px")
                        .attr("fill", "gray")
                        .attr("font-weight", "bold")
                        .text("Recibidos")
                    
                    G.selectAll(".team_circle")
                        .data(d => {
                            // console.log(Object.values(d).slice(3, 15));
                            return Object.entries(d).slice(3, 15);
                        })
                        .join(
                            enter => {
                                let circles = enter.append("circle")

                                circles.attr("class", "team_circle")
                                    .attr("class", "stat")
                                    .transition()
                                    .duration(500)
                                    .attr("cx", (d, i) => {
                                        // console.log(d, Math.trunc(i / 3));
                                        if (Math.trunc(i / 3) % 2 == 0) {
                                            let x = Math.cos((150 - 60 * (i % 6)) * (Math.PI / 180)) * dataRadialScale1(d[1]);
                                            return WIDTH / 2 + x;
                                        } else {
                                            let x = Math.cos((150 - 60 * (i % 6)) * (Math.PI / 180)) * dataRadialScale2(d[1]);
                                            return WIDTH / 2 + x;
                                        }
                                    })
                                    .attr("cy", (d, i) => {
                                        if (Math.trunc(i / 3) % 2 == 0){
                                            let y = Math.sin((150 - 60 * (i % 6)) * (Math.PI / 180)) * dataRadialScale1(d[1]);
                                            return HEIGHT / 2 - y;
                                        } else {
                                            let y = Math.sin((150 - 60 * (i % 6)) * (Math.PI / 180)) * dataRadialScale2(d[1]);
                                            return HEIGHT / 2 - y;
                                        }
                                    })
                                    .attr("r", 3.5)
                                    .attr("fill", (_, i) => i < 6 ? "#79B4A9" : "#7765E3")
                                
                                return circles;
                            }
                        )
                    
                    G.append("path")
                        .attr("class", "team_path_1")
                        .transition()
                        .duration(1000)
                        .attr("d", d => {
                            return getPathCoordinates(d, 1);
                        }
                        )
                        .attr("stroke", "#79B4A9")
                        .attr("stroke-width", 1.5)
                        .attr("fill", "#79B4A9")
                        .attr("fill-opacity", 0.2)

                    G.append("path")
                        .attr("class", "team_path_2")
                        .transition()
                        .duration(1000)
                        .attr("d", d => {
                            return getPathCoordinates(d, 2);
                        }
                        )
                        .attr("stroke", "#7765E3")
                        .attr("stroke-width", 1.5)
                        .attr("fill", "#7765E3")
                        .attr("fill-opacity", 0.2)

                    G.append("text")
                        .attr("class", "grid_label_1")
                        .transition()
                        .duration(500)
                        .attr("x", 444)
                        .attr("y", HEIGHT / 2 - 74)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "8px")
                        .attr("fill", "gray")
                        .text(`${max_goals_for}`)

                    G.append("text")
                        .attr("class", "grid_label_2")
                        .transition()
                        .duration(500)
                        .attr("x", 454)
                        .attr("y", HEIGHT / 2 + 74)
                        .attr("text-anchor", "start")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "8px")
                        .attr("fill", "gray")
                        .text(`${max_goals_against}`)

                    G.append("text")
                        .attr("class", "grid_label_3")
                        .transition()
                        .duration(500)
                        .attr("x", WIDTH / 2)
                        .attr("y", HEIGHT / 2 - 130)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "15px")
                        .attr("font-weight", "bold")
                        .attr("fill", "gray")
                        .text(d => d.team)

                    G.append("rect")
                        .attr("class", "team_info_1_rect")
                        .attr("class", "tooltip")
                        .attr("x", WIDTH / 2 - 170)
                        .attr("y", HEIGHT / 2 - 150)
                        .attr("width", 80)
                        .attr("height", 105)
                        .attr("fill", "#79B4A9")
                        .attr("fill-opacity", 0.5)
                        .attr("stroke", "white")
                        .attr("stroke-width", 0.5)
                        .style("display", "none")
                        .style("opacity", 0)
                        .attr("rx", 5)
                        .attr("ry", 5)

                    G.append("text")
                        .attr("id", "team_info_1")
                        .attr("class", "tooltip")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("y", HEIGHT / 2 - 140)
                        .attr("text-anchor", "start")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "6px")
                        .attr("font-weight", "bold")
                        .attr("fill", "white")
                        .style("display", "none")
                        .style("opacity", 0)
                        .text("Rendimiento esperado")
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 14)
                        .text("Goles a favor")
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 9)
                        .attr("font-weight", "normal")
                        .text(d => `Tiempo completo: ${d.last5_fulltime_goals_for_mean}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 9)
                        .text(d => `Primer tiempo: ${d.last5_1sthalf_goals_for_mean}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 9)
                        .text(d => `Segundo tiempo: ${d.last5_2ndhalf_goals_for_mean}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 14)
                        .attr("font-weight", "bold")
                        .text("Goles en contra")
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 9)
                        .attr("font-weight", "normal")
                        .text(d => `Tiempo completo: ${d.last5_fulltime_goals_against_mean}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 9)
                        .text(d => `Primer tiempo: ${d.last5_1sthalf_goals_against_mean}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 9)
                        .text(d => `Segundo tiempo: ${d.last5_2ndhalf_goals_against_mean}`)

                    G.append("rect")
                        .attr("class", "team_info_2_rect")
                        .attr("class", "tooltip")
                        .attr("x", WIDTH / 2 + 90)
                        .attr("y", HEIGHT / 2 - 150)
                        .attr("width", 80)
                        .attr("height", 105)
                        .attr("fill", "#7765E3")
                        .attr("fill-opacity", 0.5)
                        .attr("stroke", "white")
                        .attr("stroke-width", 0.5)
                        .style("display", "none")
                        .style("opacity", 0)
                        .attr("rx", 5)
                        .attr("ry", 5)

                    G.append("text")
                        .attr("id", "team_info_2")
                        .attr("class", "tooltip")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("y", HEIGHT / 2 - 140)
                        .attr("text-anchor", "end")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "6px")
                        .attr("font-weight", "bold")
                        .attr("fill", "white")
                        .style("display", "none")
                        .style("opacity", 0)
                        .text("Rendimiento real")
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 14)
                        .text("Goles a favor")
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 9)
                        .attr("font-weight", "normal")
                        .text(d => `Tiempo completo: ${d.fulltime_goals_for}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 9)
                        .text(d => `Primer tiempo: ${d['1sthalf_goals_for']}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 9)
                        .text(d => `Segundo tiempo: ${d['2ndhalf_goals_for']}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 14)
                        .attr("font-weight", "bold")
                        .text("Goles en contra")
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 9)
                        .attr("font-weight", "normal")
                        .text(d => `Tiempo completo: ${d.fulltime_goals_against}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 9)
                        .text(d => `Primer tiempo: ${d['1sthalf_goals_against']}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 9)
                        .text(d => `Segundo tiempo: ${d['2ndhalf_goals_against']}`)

                    G.append("text")
                        .attr("id", "rival_team")
                        .transition()
                        .duration(500)
                        .attr("x", WIDTH / 2)
                        .attr("y", HEIGHT / 2 - 120)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "8px")
                        .attr("font-weight", "bold")
                        .attr("fill", "gray")
                        .text(d => `vs. ${d.rival}`)
                    
                    G.on("click", function (event, d) {
                        console.log(event, d);
                        svg2.selectAll(".team_group")
                            .style("display", "none")
                        
                        this.classList.add("selected");

                        d3.select(this)
                            .transition()
                            .duration(500)
                            .ease(d3.easeCubicOut)
                            .attr("transform", "translate(-680, -1330) scale(2.5)")
                            .style("display", "block");

                        d3.select(this).selectAll(".tooltip")
                            .transition()
                            .duration(500)
                            .ease(d3.easeCubicOut)
                            .style("display", "block")
                            .style("opacity", 1)
                        
                        d3.select(this).selectAll(".grid_text")
                            .transition()
                            .duration(500)
                            .attr("font-size", "8px")
                            .text((_, i) => {
                                if (i == 0 || i == 3){
                                    return "Tiempo Completo"
                                } else if (i == 1 || i == 4){
                                    return "Primer Tiempo"
                                } else if (i == 2 || i == 5){
                                    return "Segundo Tiempo"
                                } else if (i == 6){
                                    return "Goles anotados"
                                } else if (i == 7){
                                    return "Goles recibidos"
                                }
                            })
                    })

                    G.on("mouseover", function (event, d) {
                        if (!this.classList.contains("selected")){
                            d3.select(this)
                                .style("cursor", "pointer")
                        }
                    })

                    G.on("mouseout", function (event, d) {
                        if (this.classList.contains("selected")){
                            d3.select(this)
                                .style("cursor", "default")
                        }
                    })
                },
                update => {
                    // console.log(update);

                    update.selectAll(".team_circle")
                        .data(d => {
                            // console.log(Object.entries(d).slice(3, 15));
                            return Object.entries(d).slice(3, 15);
                        })
                        .join(
                            enter => {
                                enter.selectAll(".stat")
                                    .transition()
                                    .duration(200)
                                    .style("opacity", 0)
                                    .remove()

                                let circles = enter.append("circle")

                                circles.attr("class", "team_circle")
                                    .attr("class", "stat")
                                    .transition()
                                    .duration(500)
                                    .attr("cx", (d, i) => {
                                        // console.log(d, Math.trunc(i / 3));
                                        if (Math.trunc(i / 3) % 2 == 0) {
                                            let x = Math.cos((150 - 60 * (i % 6)) * (Math.PI / 180)) * dataRadialScale1(d[1]);
                                            return WIDTH / 2 + x;
                                        } else {
                                            let x = Math.cos((150 - 60 * (i % 6)) * (Math.PI / 180)) * dataRadialScale2(d[1]);
                                            return WIDTH / 2 + x;
                                        }
                                    })
                                    .attr("cy", (d, i) => {
                                        if (Math.trunc(i / 3) % 2 == 0){
                                            let y = Math.sin((150 - 60 * (i % 6)) * (Math.PI / 180)) * dataRadialScale1(d[1]);
                                            return HEIGHT / 2 - y;
                                        } else {
                                            let y = Math.sin((150 - 60 * (i % 6)) * (Math.PI / 180)) * dataRadialScale2(d[1]);
                                            return HEIGHT / 2 - y;
                                        }
                                    })
                                    .attr("r", 3.5)
                                    .attr("fill", (_, i) => i < 6 ? "#79B4A9" : "#7765E3")
                                
                                return circles;
                            }
                        )
                    
                    update.select(".team_path_1")
                        .transition()
                        .duration(500)
                        .attr("d", d => {
                            return getPathCoordinates(d, 1);
                        })
                        .attr("stroke", "#79B4A9")
                        .attr("stroke-width", 2)
                        .attr("fill", "#79B4A9")
                        .attr("fill-opacity", 0.2)

                    update.select(".team_path_2")
                        .transition()
                        .duration(500)
                        .attr("d", d => {
                            return getPathCoordinates(d, 2);
                        })
                        .attr("stroke", "#7765E3")
                        .attr("stroke-width", 1.5)
                        .attr("fill", "#7765E3")
                        .attr("fill-opacity", 0.2)
                    
                    update.select(".grid_label_1")
                        .text(`${max_goals_for}`)

                    update.select(".grid_label_2")
                        .text(`${max_goals_against}`)
                    
                    update.select(".grid_label_3")
                        .text(d => d.team)

                    update.select("#team_info_1")
                        .attr("text-anchor", "start")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "6px")
                        .attr("font-weight", "bold")
                        .attr("fill", "white")
                        .text("Rendimiento esperado")
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 14)
                        .text("Goles a favor")
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 9)
                        .attr("font-weight", "normal")
                        .text(d => `Tiempo completo: ${d.last5_fulltime_goals_for_mean}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 9)
                        .text(d => `Primer tiempo: ${d.last5_1sthalf_goals_for_mean}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 9)
                        .text(d => `Segundo tiempo: ${d.last5_2ndhalf_goals_for_mean}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 14)
                        .attr("font-weight", "bold")
                        .text("Goles en contra")
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 9)
                        .attr("font-weight", "normal")
                        .text(d => `Tiempo completo: ${d.last5_fulltime_goals_against_mean}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 9)
                        .text(d => `Primer tiempo: ${d.last5_1sthalf_goals_against_mean}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 - 160)
                        .attr("dy", 9)
                        .text(d => `Segundo tiempo: ${d.last5_2ndhalf_goals_against_mean}`)

                    update.select("#team_info_2")
                        .attr("text-anchor", "end")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "6px")
                        .attr("font-weight", "bold")
                        .attr("fill", "white")
                        .text("Rendimiento real")
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 14)
                        .text("Goles a favor")
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 9)
                        .attr("font-weight", "normal")
                        .text(d => `Tiempo completo: ${d.fulltime_goals_for}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 9)
                        .text(d => `Primer tiempo: ${d['1sthalf_goals_for']}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 9)
                        .text(d => `Segundo tiempo: ${d['2ndhalf_goals_for']}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 14)
                        .attr("font-weight", "bold")
                        .text("Goles en contra")
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 9)
                        .attr("font-weight", "normal")
                        .text(d => `Tiempo completo: ${d.fulltime_goals_against}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 9)
                        .text(d => `Primer tiempo: ${d['1sthalf_goals_against']}`)
                        .append("tspan")
                        .attr("x", WIDTH / 2 + 160)
                        .attr("dy", 9)
                        .text(d => `Segundo tiempo: ${d['2ndhalf_goals_against']}`)

                    update.select('#rival_team')
                        .text(d => `vs. ${d.rival}`)
                },
                exit => {
                    exit.remove()
                }
            );
    });
}

export { createChart2 };