import { EditOutlined } from '@ant-design/icons';
import { Card, Carousel, Tooltip } from 'antd';
import 'antd/dist/reset.css';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import slider2 from '../../../../public/slider 2.jpg';
import slider1 from '../../../../public/slider1.jpg';
import { TableApi } from '../../../api/request';
import PageFooter from '../../footer/footer';
import useTable from './hooks/useTable';
import './waiterScreen.css';

const TableScreenWaiter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const { tableList, isLoading } = useTable({});
  const [filteredRows, setFilteredRows] = useState<any[]>(tableList);

  const navigate = useNavigate();
  const handleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    const filtered = tableList.filter((user_list: any) =>
      user_list?.name?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredRows(filtered);
  }, 700);

  const handleEdit = async (id: any) => {
    const response = await TableApi.getById(id);
    setData(response.data);
    setIsOpen(true);
  };

  const columns = [
    {
      title: 'Table Number',
      dataIndex: 'tableNumber',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
    },
    {
      title: 'Is Reserve',
      dataIndex: 'isReserve',
      render: (_: any, record: any) => (record?.isReserve ? 'Yes' : 'No'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: { id: any }) => (
        <Tooltip placement="top" title="Edit">
          <EditOutlined onClick={() => handleEdit(record.id)} />
        </Tooltip>
      ),
    },
  ];

  const handleTableClick = (tableNumber: number, tableId: string) => {
    navigate(`/table-screen/${tableNumber}`, { state: tableId });
  };

  return (
    <>
      <Carousel afterChange={() => { }} autoplay>
        <div>
          <img
            src={slider1}
            alt="banner"
            className="banner-image"
          />
        </div>
        <div>
          <img
          src={slider2}
            alt="banner"
            className="banner-image"
          />
        </div>
        <div>
          <img
            src={slider1}
            alt="banner"
            className="banner-image"
          />
        </div>
        <div>
          <img
           src={slider2}
            alt="banner"
            className="banner-image"
          />
        </div>
      </Carousel>
      <Card className="table-card-container">
        <PageFooter />
        <div className="table-card-grid">
          {tableList?.map((item: any) => (
            // <Link to={`/table-screen/${item?.tableNumber}`} key={item?.tableNumber}>
            <Card
              className="table-card"
              style={{ backgroundColor: item?.isReserve ? 'red' : 'green', color: 'white' }}
              onClick={() => handleTableClick(item.tableNumber, item.id)}
            >
              <div className="table-btn" >

                <div style={{ fontSize: '14px', fontWeight: "bold" }}> <span style={{ fontSize: "22px" }}>{item?.tableNumber} </span>  <br /><i>Table No</i>   </div>
                {/* <div style={{fontSize:'14px', fontWeight:"bold"}}>Seat Capacity: {item?.capacity}</div> */}
              </div>
            </Card>
            // </Link>
          ))}
        </div>
      </Card>
    </>
  );
}

export default TableScreenWaiter;
