import React, { useState } from 'react';
import { getWalletData, walletValidation } from '../../requests';
import Loader from '../Loader/Loader';
import Table from '../Table/Table';
import Nav from '../Nav/Nav';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import trashIcon from '../../Assets/trash.svg';
import filterIcon from '../../Assets/filter.svg';
import './MainView.css';

function MainView() {
  const [newWallet, setWallet] = useState('');
  const [wallets, updateWallets] = useState([]);
  const [walletsData, setWalletsData] = useState([]);
  const [displayedWallets, setDisplayedWalletsData] = useState([]);
  const [isAdded, setAddedState] = useState(false);
  const [isValidated, setValidationState] = useState(true);
  const [isInBase, setIsInBase] = useState(false);
  const [filter, setFilter] = useState('');
  const [isLoading, setLoadingState] = useState(false);

  const getMultipleWalletsData = () => {
    const fetchWalletDataPromises = [];
    setLoadingState(true);
    wallets.forEach(wallet => {
      const walletData = getWalletData(wallet)
      fetchWalletDataPromises.push(walletData)
    })

    Promise.all(fetchWalletDataPromises).then(values => {
      setWalletsData(values);
      setDisplayedWalletsData(values);
    })
    setLoadingState(false);
  }

  const addNewWalet = () => {
    const walletsUpdated = [...wallets];

    if(wallets.includes(newWallet.trim())){
      setIsInBase(true);
      return false;
    }
    setIsInBase(false);

    walletValidation(newWallet).then(resp => {
      const { result } = resp;

      setValidationState(result);

      if(!result){
        return false;
      } else {
        walletsUpdated.push(newWallet);

        updateWallets(walletsUpdated);

        setWallet('');

        setAddedState(true);
      }
    });
  } 

  const removeInput = (index) => {
    const updatedListWallet = [...wallets].filter(wallet => wallet !== wallets[index])
    
    updateWallets(updatedListWallet);

    if(wallets.length === 1) {
      setAddedState(false);
    }
  }

  const filterBy = () => {
    if(filter) {
      const filteredWallet = walletsData.filter(wallet => {

        const createTime = wallet.create_time ? format(new Date(wallet.create_time), 'H:mm dd.MM.yy') : wallet.create_time === 'No data';
        const latestOperationTime = wallet.latest_opration_time ? format(new Date(wallet.latest_opration_time), 'H:mm dd.MM.yy') : wallet.latest_opration_time === 'No data';       
        const balance = wallet.balance ? wallet.balance : wallet.balance === 'No data';
        const address = wallet.address ? wallet.address : wallet.address === 'No data';

        return (
          address.toString().toLowerCase().includes(filter.toLowerCase()) ||
          createTime.toString().toLowerCase().includes(filter.toLowerCase()) ||
          latestOperationTime.toString().toLowerCase().includes(filter.toLowerCase()) ||
          balance.toString().toLowerCase().includes(filter.toLowerCase())
        )
      })

      setDisplayedWalletsData(filteredWallet);
    } else {
      setDisplayedWalletsData(walletsData);
    }
  }

  return(
    <>
      <Nav />
      <div className='container container--mainview'>
        <aside>
          <label htmlFor='walletFinder'>Add a wallet:</label>
          <input
            className={`search-input ${!isValidated ? 'search-input--error' : ''}`}
            id='walletFinder'
            autoComplete='off' 
            // onKeyPress={event => sendRequest(searchWallet, event)}
            onChange={event => {setWallet(event.target.value)}}
            value={newWallet}
            aria-label='Enter the wallet you want to add'
            type='text'
            placeholder='TGmcz6YNqeXUoNryw4LcPeTWmo1DWrxRUK'  
          />
          {!isValidated && (
            <p className='error-info'>The wallet is invalid!</p>
          )}
          {isInBase && (
            <p className='error-info'>The wallet is already on the list!</p>
          )}
          <button className='btn--add' onClick={() => addNewWalet()}>ADD</button>
          {isAdded ? <label className='inputs-label'>Added wallets:</label> : ''}
          {wallets.map((wallet, index) => {
            return (
              <div className='input-and-btn' key={uuidv4()}>
                <input className='input--walet' type="text" value={wallet} readOnly key={index} aria-label='Your added wallets' />
                <button className='btn--remove-input' onClick={() => removeInput(index)} key={uuidv4()}>
                  <img className='trash-icon' src={trashIcon} alt='Trash icon' />
                </button>
              </div>
            )
          })}
          {isAdded ? <button className='btn--get' onClick={getMultipleWalletsData}>Get fresh data</button> : ''}
        </aside>
        {isLoading && (<Loader />)}
        {!isLoading && (<div className='main-display'>
          <div className='input-and-btn'>
            <input 
              className='input--filter'
              type='text' 
              autoComplete='off' 
              onChange={event => {setFilter(event.target.value)}}
              value={filter}
              aria-label='Enter the word you want to search for'
            />
            <button className='btn--filter' onClick={() => filterBy()}>
              <img className='filter-icon' src={filterIcon} alt='Filter icon' />
            </button>
          </div>
          <Table walletsData={displayedWallets} setWalletsData={setDisplayedWalletsData} filter={filter} />
        </div>)}
      </div>
    </>
  )
};

export default MainView;
