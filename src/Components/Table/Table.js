import React, { useState } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { PropTypes } from 'prop-types';
import sortIcon from '../../Assets/sort.svg';
import trashIcon from '../../Assets/trash.svg';
import './Table.css';

function Table({ walletsData, setWalletsData }) {
  const [order, setOrder] = useState(false);

  const columnHeaders = [
    {
      label: 'Address',
      key: 'address'
    },
    {
      label: 'Balance',
      key: 'balance'
    },
    {
      label: 'Create time',
      key: 'create_time'
    },
    {
      label: 'Latest operation time',
      key: 'latest_opration_time'
    }
  ];

  const removeRow = index => {
    const updatedWalletsData = [...walletsData].filter(wallet => wallet !== walletsData[index]);

    setWalletsData(updatedWalletsData);
  };

  const sortColumn = key => {
    if (order === false) {
      setOrder(true);
      walletsData.sort((a, b) => (a[key] > b[key] ? 1 : -1));
    } else {
      setOrder(false);
      walletsData.sort((a, b) => (a[key] < b[key] ? 1 : -1));
    }
  };

  return (
    <table>
      <thead>
        <tr>
          {columnHeaders.map(({ label, key }) => (
            <th key={key}>
              {label}
              <button className='btn--sort' onClick={() => sortColumn(key)}>
                <img className='sort-icon' src={sortIcon} alt='Sort icon' />
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {walletsData.map(
          (
            {
              address = 'No data',
              balance = 'No data',
              create_time = 'No data',
              latest_opration_time = 'No data'
            },
            index
          ) => (
            <tr id={index} key={uuidv4()}>
              <td>{address}</td>
              <td>{balance}</td>
              <td>{`${format(new Date(create_time), 'H:mm dd.MM.yy')}`}</td>
              <td>{`${format(new Date(latest_opration_time), 'H:mm dd.MM.yy')}`}</td>
              <td>
                <button className='btn--trash' onClick={() => removeRow(index)}>
                  <img className='trash-icon' src={trashIcon} alt='Trash icon' />
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

Table.propTypes = {
  walletsData: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setWalletsData: PropTypes.func.isRequired
};

Table.defaultProps = {};

export default Table;
