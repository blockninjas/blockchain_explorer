import React, { FunctionComponent } from 'react';
import ReactEcharts, { EventMap } from 'echarts-for-react'; 
import echarts from 'echarts';

echarts.registerTheme('blockninjas', {
  //backgroundColor: '#ccc'
});

type Address = {
  base58check: string
}

const Graph: FunctionComponent<{addresses: Array<String>}> = ({addresses}) => {
  // TODO load addresses from GraphQL endpoint
  // console.log(addresses);
  const height = "100%";
  const width = "100%";
  
  let data = [];
  let edges = [];

  for (let address of addresses) {
    data.push({
      id: data.length.toString(),
      name: address,
      category: "Coinbase"
    });
    let source = Math.round((data.length - 1) * Math.random());
    let target = Math.round((data.length - 1) * Math.random());
    if (source !== target) {
        edges.push({
            source: source,
            target: target
        });
    }
  }

  const onEvents: EventMap = {
    'click': (event) => console.log(event)
  }
  
  return (
    <ReactEcharts
      onEvents={onEvents}
      style={{height: height || '100%', width: width || '100%'}}
      option={{series: [{
        type: 'graph',
        layout: 'circular',
        animation: false,
        label: {
          normal: {
            position: 'right',
            formatter: '{b}'
          }
        },
        edgeSymbol: ['none', 'arrow'],
        //symbolSize: 30,
        draggable: true,
        data: data,
        roam: true,
        edges: edges,
        categories: [{name: 'Coinbase'}],
        //categories: webkitDep.categories, // TAGS
        force: {
          // initLayout: 'circular'
          // repulsion: 20,
          edgeLength: 7,
          repulsion: 20,
          gravity: 0.2
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3,
          width: 4,
        },
        emphasis: {
          lineStyle: {
              width: 10
          }
        },
        focusNodeAdjacency: true,
        itemStyle: {
          normal: {
            borderColor: '#fff',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
      }]}}
      notMerge={true}
      lazyUpdate={true}
      theme={"blockninjas"}
    />
  )
}

export default Graph;