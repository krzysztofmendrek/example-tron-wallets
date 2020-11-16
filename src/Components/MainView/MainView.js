import React, { useState } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { getWalletData, walletValidation } from '../../requests';
import Loader from '../Loader/Loader';
import Table from '../Table/Table';
import Nav from '../Nav/Nav';
import trashIcon from '../../Assets/trash.svg';
import filterIcon from '../../Assets/filter.svg';
import warningIcon from '../../Assets/warning.svg';
import './MainView.css';

function MainView() {
  const [newWallet, setNewWallet] = useState('');
  const [listWallets, updateListWallets] = useState([]);
  const [walletsData, setWalletsData] = useState([]);
  const [displayedWallets, setDisplayedWalletsData] = useState([]);
  const [isAdded, setAddedState] = useState(false);
  const [isValidatedWallet, setValidationState] = useState('');
  const [walletFilter, setWalletFilter] = useState('');
  const [isLoading, setLoadingState] = useState(false);

  const getMultipleWalletsData = () => {
    const fetchWalletDataPromises = [];
    setLoadingState(true);
    listWallets.forEach(wallet => {
      const walletData = getWalletData(wallet);
      fetchWalletDataPromises.push(walletData);
    });

    Promise.all(fetchWalletDataPromises)
      .then(values => {
        setWalletsData(values);
        setDisplayedWalletsData(values);
      })
      .catch(error => {
        if (error) {
          setValidationState('We cannot download the data, please try again later.');
        }
      });
    setLoadingState(false);
    setValidationState('');
  };

  const onEnterPress = event => {
    if (event.key === 'Enter') {
      if (event.target.id === 'walletFinder') {
        addNewWalet();
      }
      if (event.target.id === 'walletFilter') {
        filterBy();
      }
    }
  };

  const addNewWalet = () => {
    const walletsUpdated = [...listWallets];

    if (listWallets.includes(newWallet.trim())) {
      setValidationState('The wallet is already on the list!');
      return false;
    }
    setValidationState('');

    walletValidation(newWallet)
      .then(resp => {
        const { result } = resp;

        if (!result) {
          setValidationState('The wallet is invalid!');
          return false;
        }
        walletsUpdated.push(newWallet);

        updateListWallets(walletsUpdated);

        setNewWallet('');

        setAddedState(true);
        return true;
      })
      .catch(error => {
        if (error) {
          setValidationState('We cannot validate wallet, please try again later.');
        }
      });
    setValidationState('');
    return true;
  };

  const removeInput = index => {
    const updatedListWallet = [...listWallets].filter(wallet => wallet !== listWallets[index]);

    updateListWallets(updatedListWallet);

    if (listWallets.length === 1) {
      setAddedState(false);
    }
  };

  const filterBy = () => {
    if (walletFilter) {
      const filteredWallet = walletsData.filter(wallet => {
        const createTime = wallet.create_time
          ? format(new Date(wallet.create_time), 'H:mm dd.MM.yy')
          : wallet.create_time === 'No data';

        const latestOperationTime = wallet.latest_opration_time
          ? format(new Date(wallet.latest_opration_time), 'H:mm dd.MM.yy')
          : wallet.latest_opration_time === 'No data';

        const balance = wallet.balance ? wallet.balance : wallet.balance === 'No data';

        const address = wallet.address ? wallet.address : wallet.address === 'No data';

        return (
          address.toString().toLowerCase().includes(walletFilter.toLowerCase()) ||
          createTime.toString().toLowerCase().includes(walletFilter.toLowerCase()) ||
          latestOperationTime.toString().toLowerCase().includes(walletFilter.toLowerCase()) ||
          balance.toString().toLowerCase().includes(walletFilter.toLowerCase())
        );
      });
      setWalletFilter('');

      setDisplayedWalletsData(filteredWallet);
    } else {
      setDisplayedWalletsData(walletsData);
    }
  };

  return (
    <>
      <Nav />
      <div className='container container--mainview'>
        <aside>
          <label>Add a wallet:</label>
          <input
            className={`search-input ${
              isValidatedWallet === 'The wallet is invalid!' ? 'search-input--error' : ''
            }`}
            id='walletFinder'
            autoComplete='off'
            onKeyPress={event => onEnterPress(event)}
            onChange={event => {
              setNewWallet(event.target.value);
            }}
            value={newWallet}
            aria-label='Enter the wallet you want to add'
            type='text'
            placeholder='TGmcz6YNqeXUoNryw4LcPeTWmo1DWrxRUK'
          />
          {isValidatedWallet === 'The wallet is invalid!' && (
            <p className='error-info'>{isValidatedWallet}</p>
          )}
          {isValidatedWallet === 'The wallet is already on the list!' && (
            <p className='error-info'>{isValidatedWallet}</p>
          )}
          {isValidatedWallet === 'We cannot validate wallet, please try again later.' && (
            <p className='error-info'>{isValidatedWallet}</p>
          )}
          <button className='btn--add' onClick={() => addNewWalet()}>
            ADD
          </button>
          {isAdded ? <label className='inputs-label'>Added wallets:</label> : ''}
          {listWallets.map((wallet, index) => (
            <div className='input-and-btn' key={uuidv4()}>
              <input
                className='input--walet'
                type='text'
                value={wallet}
                readOnly
                key={uuidv4()}
                aria-label='Your added wallets'
              />
              <button
                className='btn--remove-input'
                onClick={() => removeInput(index)}
                key={uuidv4()}>
                <img className='trash-icon' src={trashIcon} alt='Trash icon' />
              </button>
            </div>
          ))}
          {isAdded ? (
            <button className='btn--get' onClick={getMultipleWalletsData}>
              Get fresh data
            </button>
          ) : (
            ''
          )}
        </aside>
        {isLoading && <Loader />}
        {isValidatedWallet === 'We cannot download the data, please try again later.' && (
          <div className='error-wrapper'>
            <img className='warning-icon' src={warningIcon} alt='Warning icon' />
            <p className='catched-error'>{isValidatedWallet}</p>
          </div>
        )}
        {!isLoading &&
          isValidatedWallet !== 'We cannot download the data, please try again later.' && (
            <div className='main-display'>
              <div className='input-and-btn'>
                <input
                  id='walletFilter'
                  className='input--filter'
                  type='text'
                  onKeyPress={event => onEnterPress(event)}
                  autoComplete='off'
                  onChange={event => {
                    setWalletFilter(event.target.value);
                  }}
                  value={walletFilter}
                  aria-label='Enter the word you want to search for'
                />
                <button className='btn--filter' onClick={() => filterBy()}>
                  <img className='filter-icon' src={filterIcon} alt='Filter icon' />
                </button>
              </div>
              <Table walletsData={displayedWallets} setWalletsData={setDisplayedWalletsData} />
            </div>
            // eslint-disable-next-line prettier/prettier
        )}
      </div>
    </>
  );
}

export default MainView;
