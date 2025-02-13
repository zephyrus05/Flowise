import PropTypes from 'prop-types'
import { useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import { IconButton, Box, Typography, Divider, Button } from '@mui/material'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'

// project imports
import MainCard from 'ui-component/cards/MainCard'
import NodeInputHandler from './NodeInputHandler'
import NodeOutputHandler from './NodeOutputHandler'
import AdditionalParamsDialog from 'ui-component/dialog/AdditionalParamsDialog'
import NodeInfoDialog from 'ui-component/dialog/NodeInfoDialog'

// const
import { baseURL } from 'store/constant'
import { IconTrash, IconCopy, IconInfoCircle, IconAlertTriangle } from '@tabler/icons'
import { flowContext } from 'store/context/ReactFlowContext'

const CardWrapper = styled(MainCard)(({ theme }) => ({
    background: theme.palette.card.main,
    color: theme.darkTextPrimary,
    border: 'solid 2.5px',
    borderColor: '#2F5597', //theme.palette.primary[200] + 75,
    width: '300px',
    height: 'auto',
    padding: '10px',
    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
    '&:hover': {
        borderColor: '#EC73FF' //theme.palette.card.main
    }
}))

const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.nodeToolTip.background,
        color: theme.palette.nodeToolTip.color,
        boxShadow: theme.shadows[1]
    }
}))

// ===========================|| CANVAS NODE ||=========================== //

const CanvasNode = ({ data }) => {
    const theme = useTheme()
    const canvas = useSelector((state) => state.canvas)
    const { deleteNode, duplicateNode } = useContext(flowContext)

    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [showInfoDialog, setShowInfoDialog] = useState(false)
    const [infoDialogProps, setInfoDialogProps] = useState({})
    const [warningMessage, setWarningMessage] = useState('')
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const NodeBorder = () => {
        if (data.category == 'Agents') {
            return '#0066CC'
        } else if (data.category == 'Chains') {
            return '#009966'
        } else if (data.category == 'Chat Models') {
            return '#CC0033'
        } else if (data.category == 'Document Loaders') {
            return '#9933CC'
        } else if (data.category == 'Embeddings') {
            return '#FFCC00'
        } else if (data.category == 'LLMs') {
            return '#333333'
        } else if (data.category == 'Memory') {
            return '#999999'
        } else if (data.category == 'Prompts') {
            return '#33CCCC'
        } else if (data.category == 'Retrievers') {
            return '#FF9933'
        } else if (data.category == 'Text Splitters') {
            return '#FF66B2'
        } else if (data.category == 'Tools') {
            return '#33CC99'
        } else if (data.category == 'Vector Stores') {
            return '#990033'
        } else if (data.category == 'Cache') {
            return '#c65102'
        } else if (data.category == 'Output Parsers') {
            return '#702963'
        } else if (data.category == 'Moderation') {
            return '#702963'
        }
        return '#000000'
    }

    const NodeHeader = () => {
        if (data.category == 'Agents') {
            return ' #66B2FF'
        } else if (data.category == 'Chains') {
            return '#66FFB2'
        } else if (data.category == 'Chat Models') {
            return '#FF6688'
        } else if (data.category == 'Document Loaders') {
            return '#CC99FF'
        } else if (data.category == 'Embeddings') {
            return '#FFFF99'
        } else if (data.category == 'LLMs') {
            return '#B2B2B2'
        } else if (data.category == 'Memory') {
            return '#D9D9D9'
        } else if (data.category == 'Prompts') {
            return '#99E6E6'
        } else if (data.category == 'Retrievers') {
            return '#FFCC99'
        } else if (data.category == 'Text Splitters') {
            return '#FF99CC'
        } else if (data.category == 'Tools') {
            return '#99FFCC'
        } else if (data.category == 'Vector Stores') {
            return '#FF99B2'
        } else if (data.category == 'Cache') {
            return '#FFA500'
        } else if (data.category == 'Output Parsers') {
            return '#BF40BF'
        } else if (data.category == 'Moderation') {
            return 'C63287'
        }
        return '#000000'
    }

    const nodeOutdatedMessage = (oldVersion, newVersion) => `Node version ${oldVersion} outdated\nUpdate to latest version ${newVersion}`

    const nodeVersionEmptyMessage = (newVersion) => `Node outdated\nUpdate to latest version ${newVersion}`

    const onDialogClicked = () => {
        const dialogProps = {
            data,
            inputParams: data.inputParams.filter((param) => param.additionalParams),
            confirmButtonName: 'Save',
            cancelButtonName: 'Cancel'
        }
        setDialogProps(dialogProps)
        setShowDialog(true)
    }

    useEffect(() => {
        const componentNode = canvas.componentNodes.find((nd) => nd.name === data.name)
        if (componentNode) {
            if (!data.version) {
                setWarningMessage(nodeVersionEmptyMessage(componentNode.version))
            } else {
                if (componentNode.version > data.version) setWarningMessage(nodeOutdatedMessage(data.version, componentNode.version))
            }
        }
    }, [canvas.componentNodes, data.name, data.version])

    return (
        <>
            <CardWrapper
                content={false}
                sx={{
                    padding: 0,
                    borderColor: data.selected ? NodeHeader : NodeBorder,
                    '&:hover': {
                        borderColor: data.selected ? NodeHeader : NodeHeader
                    }
                }}
                border={false}
            >
                <LightTooltip
                    open={!canvas.canvasDialogShow && open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    disableFocusListener={true}
                    title={
                        <div
                            style={{
                                background: 'transparent',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <IconButton
                                title='Duplicate'
                                onClick={() => {
                                    duplicateNode(data.id)
                                }}
                                sx={{ height: '35px', width: '35px', '&:hover': { color: theme?.palette.primary.main } }}
                                color={theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit'}
                            >
                                <IconCopy />
                            </IconButton>
                            <IconButton
                                title='Delete'
                                onClick={() => {
                                    deleteNode(data.id)
                                }}
                                sx={{ height: '35px', width: '35px', '&:hover': { color: 'red' } }}
                                color={theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit'}
                            >
                                <IconTrash />
                            </IconButton>
                            <IconButton
                                title='Info'
                                onClick={() => {
                                    setInfoDialogProps({ data })
                                    setShowInfoDialog(true)
                                }}
                                sx={{ height: '35px', width: '35px', '&:hover': { color: theme?.palette.secondary.main } }}
                                color={theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit'}
                            >
                                <IconInfoCircle />
                            </IconButton>
                        </div>
                    }
                    placement='right-start'
                >
                    <Box>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: data.selected ? NodeHeader(data) : NodeBorder(data)
                            }}
                        >
                            <Box style={{ width: 50, marginRight: 10, padding: 5 }}>
                                <div
                                    style={{
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.largeAvatar,
                                        borderRadius: '50%',
                                        backgroundColor: data.selected ? NodeHeader(data) : NodeBorder(data),
                                        cursor: 'grab'
                                    }}
                                >
                                    <img
                                        style={{ width: '100%', height: '100%', padding: 5, objectFit: 'contain' }}
                                        src={`${baseURL}/api/v1/node-icon/${data.name}`}
                                        alt='Notification'
                                    />
                                </div>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        font: 'Helvetica Neue',
                                        fontWeight: 500,
                                        mr: 2,
                                        color: '#000000'
                                    }}
                                >
                                    {data.label}
                                </Typography>
                            </Box>
                            {warningMessage && (
                                <>
                                    <div style={{ flexGrow: 1 }}></div>
                                    <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{warningMessage}</span>} placement='top'>
                                        <IconButton sx={{ height: 35, width: 35 }}>
                                            <IconAlertTriangle size={35} color='orange' />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </div>
                        {(data.inputAnchors.length > 0 || data.inputParams.length > 0) && (
                            <>
                                <Divider />
                                <Box sx={{ background: theme.palette.asyncSelect.main, p: 1 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            textAlign: 'center',
                                            color: '#2F5597'
                                        }}
                                    >
                                        Inputs
                                    </Typography>
                                </Box>
                                <Divider />
                            </>
                        )}
                        {data.inputAnchors.map((inputAnchor, index) => (
                            <NodeInputHandler key={index} inputAnchor={inputAnchor} data={data} />
                        ))}
                        {data.inputParams.map((inputParam, index) => (
                            <NodeInputHandler key={index} inputParam={inputParam} data={data} />
                        ))}
                        {data.inputParams.find((param) => param.additionalParams) && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    marginTop:
                                        data.inputParams.filter((param) => param.additionalParams).length ===
                                        data.inputParams.length + data.inputAnchors.length
                                            ? 20
                                            : 0
                                }}
                            >
                                <Button sx={{ borderRadius: 25, width: '90%', mb: 2 }} variant='outlined' onClick={onDialogClicked}>
                                    Additional Parameters
                                </Button>
                            </div>
                        )}
                        <Divider />
                        <Box sx={{ background: theme.palette.asyncSelect.main, p: 1 }}>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    textAlign: 'center',
                                    color: '#EC73FF'
                                }}
                            >
                                Output
                            </Typography>
                        </Box>
                        <Divider />

                        {data.outputAnchors.map((outputAnchor, index) => (
                            <NodeOutputHandler key={index} outputAnchor={outputAnchor} data={data} />
                        ))}
                    </Box>
                </LightTooltip>
            </CardWrapper>
            <AdditionalParamsDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
            ></AdditionalParamsDialog>
            <NodeInfoDialog show={showInfoDialog} dialogProps={infoDialogProps} onCancel={() => setShowInfoDialog(false)}></NodeInfoDialog>
        </>
    )
}

CanvasNode.propTypes = {
    data: PropTypes.object
}

export default CanvasNode
