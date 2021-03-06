import React, { useState, useContext } from 'react'
import SVG from 'react-inlinesvg'

import { NavigationContext } from 'contexts'
import { Dropdown } from 'ui'
import { NOOP } from 'utils'

import * as S from './styled'

type Link = {
  name: string
  icon: string
  href: string
  exact: boolean
}

type Props = {
  forceActive?: boolean
  links?: Link[]
  forceShowSidebar?: boolean
}

const MobileNav = ({ forceActive, links = [], forceShowSidebar }: Props) => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const whenContextIsAvailable = useContext(NavigationContext)
  const { navigateTo } = forceShowSidebar
    ? { navigateTo: NOOP }
    : whenContextIsAvailable

  const handleLogoClick = () => {
    setIsActive(false)
    navigateTo('/')
  }

  return (
    <S.Wrapper>
      <S.Header>
        <S.Logo src="/images/logo.svg" onClick={handleLogoClick} />
        <S.Hamburger
          active={forceActive || isActive}
          onClick={() => setIsActive(!isActive)}
        >
          <span />
        </S.Hamburger>
      </S.Header>
      <Dropdown isOpen={forceActive || isActive}>
        {links.map((item, idx) => (
          <S.MenuLink
            key={`menuLink-${idx}`}
            to={item.href}
            activeClassName="active"
            onClick={() => setIsActive(false)}
            exact={item.exact}
          >
            <SVG src={item.icon}>
              <img src={item.icon} alt={item.href} />
            </SVG>
            <div>{item.name}</div>
          </S.MenuLink>
        ))}
        <S.ZeePrime
          href="https://zeeprime.capital/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsActive(false)}
        >
          <SVG src="/images/zeeprime.svg">
            <img src="/images/zeeprime.svg" alt="Zee Prime Capital" />
          </SVG>
          <div>Visit Our Website</div>
        </S.ZeePrime>
      </Dropdown>
    </S.Wrapper>
  )
}

export default MobileNav
