import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
// import WalletConnect from "@walletconnect/client";//add
// import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";//add
import { errHandler, tips, /* toValue, */ fromValue, fromBigNum, walletconnect } from './util';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { useWallet } from './hooks/useWallet';


import "./layout.scss"
import "./assets/css/stars.css"
import Meta from './assets/img/metamask.png';
import Trust from './assets/img/trust.png';
import Coinbase from './assets/img/coinbase.png';
import { useWebContext } from "./context";


const Layout = (props: any) => {
	const { active, connect, chainId } = useWallet();
	const { account } = useWeb3React();
	const [scrolling, setScrolling] = React.useState<boolean>(false);
	const [up, setUp] = React.useState<boolean>(false);
	const { activate, connector } = useWeb3React();
	const [state, { dispatch }] = useWebContext();


	useEffect(() => {
		window.addEventListener('scroll', onScroll, true);
	}, [])
	let scrollTop = 0;
	const onScroll = () => {
		const scroll = document.body.scrollTop;
		if (scroll > 80) {
			if (scroll > scrollTop) {
				setScrolling(true);
				setUp(false);
			} else {
				setUp(true);
			}
		} else {
			setScrolling(false);
			setUp(false);
		}
		scrollTop = scroll;
	}

	const [WalletConnectModal, setWalletConnectModal] = useState(false);

	const handleConnect = async (key: string) => {
		try {
			await connect(key);
			setWalletConnectModal(!WalletConnectModal)
			if (account !== undefined) {
				dispatch({
					type: "disconnect_able",
					payload: true
				});
			} else {
				dispatch({
					type: "disconnect_able",
					payload: false
				});
			}
			//wallet modal cancel
		} catch (err) {
			console.log({ err });
		}
	};
	const WalletDisconectCall = () => {
		dispatch({
			type: 'disconnect_able',
			payload: false
		})
	}

	const WalletModal = () => {
		return (
			<div className='modal-continer' >
				<div className='modal-back' onClick={() => setWalletConnectModal(false)}></div>

				<div className="modal-body wallet-modal" >
					<div className='justify'>
						<div className='wallet-icon-hover'>
							<a onClick={() => handleConnect('injected')}>
								<img src={Meta} className='justify wallet-imgs' alt='metamask' />
							</a>
						</div>
						<div className='wallet-icon-hover'>
							<a onClick={() => handleConnect('walletconnect')}>
								<img src={Trust} className='justify wallet-imgs' alt='Trust' />
							</a>
						</div>
						<div className='justify'>
							<div className='wallet-icon-hover'>
								<a onClick={() => handleConnect('walletlink')}>
									<img src={Coinbase} className='justify wallet-imgs' alt='Trust' />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
	useEffect(() => {
		if (account !== undefined) {
			dispatch({
				type: "disconnect_able",
				payload: true
			});
		} else {
			dispatch({
				type: "disconnect_able",
				payload: false
			});
		}
		console.log(chainId)
	}, [account, chainId])

	return (
		<>
			<header className={'smart-scroll' + (scrolling ? ' scrolling' : '') + (up ? ' up' : '')}>
				<div className="container-fluid">
					<div className="background">
						<div id="stars"></div>
						<div id="stars2"></div>
						<div id="stars3"></div>
					</div>
					<nav className="navbar navbar-expand-md navbar-dark">
						<Link className="navbar-brand heading-black" to="./">
							THC Staking
						</Link>
						{/* <button onClick={() => setWalletConnectModal(true)} className="navbar-toggler navbar-toggler-right border-0 collapsed" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
						</button> */}
						<div className="navbar-collapse collapse dis-f">
							<ul className="navbar-nav ml-auto flex-align-center align-items-center">
								{/* <li className="nav-item">
									<Link className="nav-link page-scroll" to="./">Home</Link>
								</li> */}
								{/* <li className="nav-item">
									<Link className="nav-link page-scroll" to="./staking">Staking</Link>
								</li> */}
								<li className="nav-item">
									<a className="nav-link page-scroll p-0">
										{
											state.disconnect_able ?
												<button onClick={() => { WalletDisconectCall() }} className="btn btn-primary d-inline-flex flex-row align-items-center" id="loginButton">
													disconnect
												</button>
												:
												<button onClick={() => setWalletConnectModal(true)} className="btn btn-primary d-inline-flex flex-row align-items-center" id="loginButton">
													Wallet Connect
												</button>
										}
									</a>
								</li>
								<li className="nav-item">
									<a className="nav-link page-scroll p-0">
										{
											state.disconnect_able && account && account.length !== 0 && account.slice(0, 4) + '...' + account.slice(account.length - 4, account.length)
										}
									</a>
								</li>
								{/* account.slice(0, 4) + '...' + account.slice(account.length - 4, account.length) */}
							</ul>
						</div>
					</nav>
				</div>
			</header>
			<main>
				{props.children}
			</main>

			<footer>
				<div className="container">
					<div className="row">
						<h1>Footer</h1>
					</div>
				</div>
			</footer>

			{WalletConnectModal === true
				? <WalletModal />
				: <></>
			}

			<Outlet />
		</>
	)
}

export default Layout