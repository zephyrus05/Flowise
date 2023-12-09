import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { useRef } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Divider,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    OutlinedInput,
    Paper,
    Stack,
    Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports

// icons
import { IconSearch, IconX } from '@tabler/icons'

// const
import { baseURL } from 'store/constant'
import { SET_COMPONENT_NODES } from 'store/actions'

// ==============================|| ADD NODES ||============================== //

const AddNodes = ({ nodesData, node }) => {
    const theme = useTheme()
    const dispatch = useDispatch()

    const [searchValue, setSearchValue] = useState('')
    const [nodes, setNodes] = useState({})
    const [categoryExpanded, setCategoryExpanded] = useState({})
    const ps = useRef()

    const scrollTop = () => {
        const curr = ps.current
        if (curr) {
            curr.scrollTop = 0
        }
    }

    const getSearchedNodes = (value) => {
        const passed = nodesData.filter((nd) => {
            const passesQuery = nd.name.toLowerCase().includes(value.toLowerCase())
            const passesCategory = nd.category.toLowerCase().includes(value.toLowerCase())
            return passesQuery || passesCategory
        })
        return passed
    }

    const filterSearch = (value) => {
        setSearchValue(value)
        setTimeout(() => {
            if (value) {
                const returnData = getSearchedNodes(value)
                groupByCategory(returnData, true)
                scrollTop()
            } else if (value === '') {
                groupByCategory(nodesData)
                scrollTop()
            }
        }, 500)
    }

    const groupByCategory = (nodes, isFilter) => {
        const accordianCategories = {}
        const result = nodes.reduce(function (r, a) {
            const categoryKey = a.badge ? `${a.category};${a.badge}` : a.category
            r[categoryKey] = r[categoryKey] || []
            r[categoryKey].push(a)
            accordianCategories[categoryKey] = isFilter ? true : false
            return r
        }, Object.create(null))

        categorizeVectorStores(result, accordianCategories, isFilter)

        setNodes(result)
        setCategoryExpanded(accordianCategories)
    }

    const categorizeVectorStores = (nodes, accordianCategories, isFilter) => {
        const obj = { ...nodes }
        const vsNodes = obj['Vector Stores'] ?? []
        const deprecatingNodes = []
        const newNodes = []

        for (const vsNode of vsNodes) {
            if (vsNode.badge === 'DEPRECATING') deprecatingNodes.push(vsNode)
            else newNodes.push(vsNode)
        }

        delete obj['Vector Stores']

        if (deprecatingNodes.length) {
            obj['Vector Stores;DEPRECATING'] = deprecatingNodes
            accordianCategories['Vector Stores;DEPRECATING'] = isFilter ? true : false
        }

        if (newNodes.length) {
            obj['Vector Stores;NEW'] = newNodes
            accordianCategories['Vector Stores;NEW'] = isFilter ? true : false
        }

        setNodes(obj)
    }

    const handleAccordionChange = (category) => () => {
        setCategoryExpanded((prevExpanded) => ({
            ...prevExpanded,
            [category]: !prevExpanded[category]
        }))
    }

    const onDragStart = (event, node) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(node))
        event.dataTransfer.effectAllowed = 'move'
    }

    useEffect(() => {
        if (nodesData) {
            groupByCategory(nodesData)
            dispatch({ type: SET_COMPONENT_NODES, componentNodes: nodesData })
        }
    }, [nodesData, dispatch])

    return (
        <Paper
            sx={{
                position: 'relative',
                left: 0,
                top: '30px',
                bottom: 0,
                zIndex: 1000,
                width: '250px', // Adjust the width as needed
                borderRight: `1px solid ${theme.palette.divider}`
            }}
        >
            <Box sx={{ p: 2 }}>
                <Stack>
                    <Typography variant='h4'>Add Nodes</Typography>
                </Stack>
                <OutlinedInput
                    sx={{ width: '100%', pr: 2, pl: 2, my: 2 }}
                    id='input-search-node'
                    value={searchValue}
                    onChange={(e) => filterSearch(e.target.value)}
                    placeholder='Search nodes'
                    startAdornment={
                        <InputAdornment position='start'>
                            <IconSearch stroke={1.5} size='1rem' color={theme.palette.grey[500]} />
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment
                            position='end'
                            sx={{
                                cursor: 'pointer',
                                color: theme.palette.grey[500],
                                '&:hover': {
                                    color: theme.palette.grey[900]
                                }
                            }}
                            title='Clear Search'
                        >
                            <IconX
                                stroke={1.5}
                                size='1rem'
                                onClick={() => filterSearch('')}
                                style={{
                                    cursor: 'pointer'
                                }}
                            />
                        </InputAdornment>
                    }
                    aria-describedby='search-helper-text'
                    inputProps={{
                        'aria-label': 'weight'
                    }}
                />
                <Divider />
            </Box>
            <PerfectScrollbar
                containerRef={(el) => {
                    ps.current = el
                }}
                style={{ height: '100%', maxHeight: 'calc(100vh - 320px)', overflowX: 'hidden' }}
            >
                <Box sx={{ p: 2 }}>
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 370,
                            py: 0,
                            borderRadius: '10px',
                            '& .MuiListItemSecondaryAction-root': {
                                top: 22
                            },
                            '& .MuiDivider-root': {
                                my: 0
                            },
                            '& .list-container': {
                                pl: 7
                            }
                        }}
                    >
                        {Object.keys(nodes)
                            .sort()
                            .map((category) => (
                                <Accordion
                                    expanded={categoryExpanded[category] || false}
                                    onChange={handleAccordionChange(category)}
                                    key={category}
                                    disableGutters
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`nodes-accordion-${category}`}
                                        id={`nodes-accordion-header-${category}`}
                                    >
                                        <Typography variant='h5'>
                                            {category.split(';').length > 1 ? (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Typography variant='h5'>{category.split(';')[0]}</Typography>
                                                    &nbsp;
                                                    {category.split(';')[1] === 'DEPRECATING' ? (
                                                        <div
                                                            style={{
                                                                width: 120,
                                                                height: 20,
                                                                borderRadius: '50%',
                                                                backgroundColor: theme.palette.warning.main,
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <Typography variant='caption' style={{ color: 'black' }}>
                                                                {category.split(';')[1]}
                                                            </Typography>
                                                        </div>
                                                    ) : category.split(';')[1] === 'NEW' ? (
                                                        <div
                                                            style={{
                                                                width: 50,
                                                                height: 20,
                                                                borderRadius: '50%',
                                                                backgroundColor: theme.palette.success.main,
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <Typography variant='caption' style={{ color: 'black' }}>
                                                                {category.split(';')[1]}
                                                            </Typography>
                                                        </div>
                                                    ) : (
                                                        <Typography variant='h5'>{category.split(';')[1]}</Typography>
                                                    )}
                                                </div>
                                            ) : (
                                                <Typography variant='h5'>{category}</Typography>
                                            )}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <List>
                                            {nodes[category].map((node, index) => (
                                                <div key={node.name} onDragStart={(event) => onDragStart(event, node)} draggable>
                                                    <ListItem
                                                        alignItems='flex-start'
                                                        sx={{
                                                            cursor: 'move'
                                                        }}
                                                    >
                                                        <ListItemAvatar>
                                                            <div
                                                                style={{
                                                                    width: 50,
                                                                    height: 50,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'white'
                                                                }}
                                                            >
                                                                <img
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        padding: 10,
                                                                        objectFit: 'contain'
                                                                    }}
                                                                    alt={node.name}
                                                                    src={`${baseURL}/api/v1/node-icon/${node.name}`}
                                                                />
                                                            </div>
                                                        </ListItemAvatar>
                                                        <ListItemText sx={{ ml: 1 }} primary={node.label} title={node.description} />
                                                    </ListItem>
                                                    {index === nodes[category].length - 1 ? null : <Divider />}
                                                </div>
                                            ))}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                    </List>
                </Box>
            </PerfectScrollbar>
        </Paper>
    )
}

AddNodes.propTypes = {
    nodesData: PropTypes.array,
    node: PropTypes.object
}

export default AddNodes
