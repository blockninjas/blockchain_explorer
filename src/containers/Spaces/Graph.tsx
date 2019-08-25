import React, { FunctionComponent, useState } from 'react';
import ReactEcharts, { EventMap } from 'echarts-for-react';
import echarts from 'echarts';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

echarts.registerTheme('blockninjas', {
  backgroundColor: 'transparent'
});

type Props = {
  addresses: Array<string>;
  edges: Array<{ source: string, target: string }>;
  onSelectAddress?: (address: string) => void;
  selectedAddress: string;
  onDeleteAddress?: (address: string) => void;
};

const Graph: FunctionComponent<Props> = ({ addresses, edges, onSelectAddress, onDeleteAddress }) => {
  const [contextMenu, setContextMenu] = useState({ isOpen: false, address: "", x: 0, y: 0 });

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
    'click': (graphEvent) => {
      if (graphEvent.dataType === "node") {
        console.log('Graph node selected', graphEvent.data);

        const selectedNode: { id: string, category: string, name: string } = graphEvent.data;
        const address = selectedNode.name;
        if (onSelectAddress) {
          onSelectAddress(address);
        }
      }
    },
    'contextMenu': (graphEvent) => {
      graphEvent.event.event.preventDefault();

      if (!graphEvent.data.id) {
        return;
      }

      setContextMenu({ 
        ...contextMenu, 
        isOpen: true,
        address: graphEvent.data.id,
        x: graphEvent.event.offsetX,
        y: graphEvent.event.offsetY
      });
    }
  }

  return (
    <>
      <ButtonDropdown 
          isOpen={contextMenu.isOpen} 
          toggle={() => setContextMenu({ ...contextMenu, isOpen: false })} 
          style={{
            visibility: contextMenu.isOpen ? 'visible' : 'hidden',
            position: 'absolute',
            left: contextMenu.x,
            top: contextMenu.y - 15
          }}
        >
        <DropdownToggle caret size="sm" className="bg-transparent border-0 text-light" />
        <DropdownMenu>
          <DropdownItem header className="text-small">{contextMenu.address}</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={() => onDeleteAddress && onDeleteAddress(contextMenu.address)}>Delete Address</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>

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
            draggable: true,
            data: data,
            roam: true,
            edges: edges,
            categories: [{ name: 'Coinbase' }],
            //categories: webkitDep.categories, // TAGS
            force: {
              // initLayout: 'circular'
              edgeLength: 7,
              repulsion: 20,
              gravity: 0.2
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3,
              width: 3,
            },
            emphasis: {
              lineStyle: {
                width: 5,
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
    </>
  )
}

export default Graph;