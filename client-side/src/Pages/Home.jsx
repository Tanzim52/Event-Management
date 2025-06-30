import React from 'react';
import Banner from '../Components/HomePageElements/Banner';
import HowItWorks from '../Components/HomePageElements/HowItWorks';
import WhyUs from '../Components/HomePageElements/WhyUs';
import Upcoming from '../Components/HomePageElements/UpComing';
import CallToAction from '../Components/HomePageElements/CallToAction';

const Home = () => {
    return (
        <>
        <Banner></Banner>
        <HowItWorks></HowItWorks>
        <WhyUs></WhyUs>
        <Upcoming></Upcoming>
        <CallToAction></CallToAction>
        </>
    );
};

export default Home;