import React, { FunctionComponent } from 'react';
import ReactEcharts, { EventMap } from 'echarts-for-react';
import echarts from 'echarts';

echarts.registerTheme('blockninjas', {
  //backgroundColor: '#ccc'
});

type Address = {
  base58check: string
}

type Props = {
  addresses: Array<string>;
  edges: Array<{ source: string, target: string }>;
  onSelectAddress?: (address: String) => void;
};

const Graph: FunctionComponent<Props> = ({ addresses, onSelectAddress, edges }) => {
  const height = "100%";
  const width = "100%";

  let data = [];

  for (let address of addresses) {
    data.push({
      id: address,
      name: address,
      category: "Coinbase" // FIXME
    });
  }

  console.log("Echarts Edges", edges);
  console.log("Echarts Nodes", data);

  const onEvents: EventMap = {
    'click': (event) => {
      if (event.dataType === "node") {
        console.log('Graph node selected', event.data);

        const selectedNode: { id: String, category: String, name: String } = event.data;
        const address = selectedNode.name;
        if (onSelectAddress) {
          onSelectAddress(address);
        }
      }
    }
  }

  return (
    <ReactEcharts
      onEvents={onEvents}
      style={{ height: height || '100%', width: width || '100%' }}
      option={{
        series: [{
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
          categories: [{ name: 'Coinbase' }],
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
              width: 20,
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
        }]
      }}
      notMerge={true}
      lazyUpdate={true}
      theme={"blockninjas"}
    />
  )
}

export default Graph;